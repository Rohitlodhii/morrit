import { createFilter, type FilterPattern } from '@rollup/pluginutils'
import { parse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import path from 'path'
import sourceLensBabelPlugin from '../babel-plugin'
import { sourceLensMiddleware } from '../middleware'
import type { SourceLensOptions } from '../types'

interface VitePlugin {
  name: string
  enforce?: 'pre' | 'post'
  apply?: 'serve' | 'build' | ((this: void, config: unknown, env: { command: string; mode: string }) => boolean)
  transform?: (code: string, id: string) => { code: string; map?: unknown } | null | undefined
  configureServer?: (server: { middlewares: { use: (...args: unknown[]) => void } }) => void
}

interface VitePluginOptions extends Omit<SourceLensOptions, 'exclude'> {
  include?: FilterPattern
  exclude?: FilterPattern
  editor?: string
  openInEditorEndpoint?: string
}

function sourceLensVitePlugin(
  options: VitePluginOptions = {}
): VitePlugin {
  const {
    include = ['**/*.jsx', '**/*.tsx'],
    exclude,
    attributeName,
    rootDir,
    editor,
    openInEditorEndpoint,
  } = options

  const resolvedRootDir = rootDir || process.cwd()
  const filter = createFilter(include, exclude)

  return {
    name: 'react-source-lens',
    enforce: 'pre',
    apply: 'serve',

    transform(code, id) {
      if (!filter(id)) return null

      const isJSX = /\.(jsx|tsx)$/.test(id)
      if (!isJSX) return null

      try {
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
          sourceFilename: id,
        })

        const result = transformFromAstSync(ast, code, {
          plugins: [
            [
              sourceLensBabelPlugin,
              {
                attributeName,
                relativeTo: resolvedRootDir,
                filename: id,
              },
            ],
          ],
          filename: id,
          code: true,
          sourceMaps: true,
          babelrc: false,
          configFile: false,
        })

        if (!result || !result.code) return null

        return {
          code: result.code,
          map: result.map,
        }
      } catch {
        return null
      }
    },

    configureServer(server) {
      server.middlewares.use(
        sourceLensMiddleware({
          rootDir: resolvedRootDir,
          editor,
          endpoint: openInEditorEndpoint,
        })
      )
    },
  }
}

export = sourceLensVitePlugin
