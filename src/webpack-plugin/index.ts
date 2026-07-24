import { parse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import sourceLensBabelPlugin from '../babel-plugin'
import type { SourceLensOptions } from '../types'
import type { Compiler, WebpackPluginInstance } from 'webpack'

function sourceLensLoader(this: any, source: string): void {
  const callback = this.async()
  if (!callback) return

  const resourcePath = this.resourcePath
  const isDev = this.mode === 'development'

  if (!isDev) {
    callback(null, source)
    return
  }

  const isJSX = /\.(jsx?|tsx)$/.test(resourcePath)
  if (!isJSX) {
    callback(null, source)
    return
  }

  try {
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      sourceFilename: resourcePath,
    })

    const result = transformFromAstSync(ast, source, {
      plugins: [
        [
          sourceLensBabelPlugin,
          { filename: resourcePath },
        ],
      ],
      filename: resourcePath,
      code: true,
      sourceMaps: true,
      babelrc: false,
      configFile: false,
    })

    if (!result || !result.code) {
      callback(null, source)
      return
    }

    callback(null, result.code, result.map ?? undefined)
  } catch {
    callback(null, source)
  }
}

export default sourceLensLoader

export class SourceLensWebpackPlugin implements WebpackPluginInstance {
  constructor(private options: SourceLensOptions = {}) {}

  apply(compiler: Compiler): void {
    compiler.hooks.afterEnvironment.tap('SourceLensWebpackPlugin', () => {
      const rule = {
        test: /\.(jsx?|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: __filename,
            options: this.options,
          },
        ],
      }

      const rules = compiler.options.module?.rules
      if (rules) {
        rules.push(rule)
      }
    })
  }
}
