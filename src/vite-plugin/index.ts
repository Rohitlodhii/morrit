import { createFilter, type FilterPattern } from '@rollup/pluginutils'
import { parse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import path from 'path'
import morritBabelPlugin from '../babel-plugin'
import type { MorritOptions } from '../types'

interface VitePlugin {
  name: string
  enforce?: 'pre' | 'post'
  apply?: 'serve' | 'build' | ((this: void, config: unknown, env: { command: string; mode: string }) => boolean)
  config?: () => { define: Record<string, string> }
  transform?: (code: string, id: string) => { code: string; map?: unknown } | null | undefined
}

interface VitePluginOptions extends Omit<MorritOptions, 'exclude'> {
  include?: FilterPattern
  exclude?: FilterPattern
}

function morritVitePlugin(
  options: VitePluginOptions = {}
): VitePlugin {
  const {
    include = ['**/*.jsx', '**/*.tsx'],
    exclude,
    attributeName,
    rootDir,
  } = options

  const resolvedRootDir = rootDir || process.cwd()
  const filter = createFilter(include, exclude)

  return {
    name: 'morrit',
    enforce: 'pre',
    apply: 'serve',

    config() {
      return {
        define: {
          __MORRIT_ROOT__: JSON.stringify(resolvedRootDir),
        },
      }
    },

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
              morritBabelPlugin,
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
  }
}

export = morritVitePlugin
