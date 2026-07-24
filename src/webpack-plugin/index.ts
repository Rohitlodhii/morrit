import { parse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import vilsonBabelPlugin from '../babel-plugin'
import type { VilsonOptions } from '../types'
import type { Compiler, WebpackPluginInstance } from 'webpack'
import path from 'path'

function shouldExclude(file: string, rootDir: string): boolean {
  const relativePath = path.relative(rootDir, file)
  return (
    file.includes('node_modules') ||
    file.includes(`${path.sep}.next${path.sep}`) ||
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath)
  )
}

function vilsonLoader(this: any, source: string): void {
  const callback = this.async()
  if (!callback) return

  const options = (typeof this.getOptions === 'function' ? this.getOptions() : {}) as VilsonOptions
  const resourcePath = this.resourcePath
  const isDev = this.mode === 'development'
  const rootDir = options.rootDir || process.cwd()

  if (!isDev || shouldExclude(resourcePath, rootDir)) {
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
          vilsonBabelPlugin,
          {
            attributeName: options.attributeName,
            exclude: options.exclude,
            filename: resourcePath,
            relativeTo: rootDir,
          },
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

const webpack = require('webpack')

export class VilsonWebpackPlugin implements WebpackPluginInstance {
  constructor(private options: VilsonOptions = {}) {}

  apply(compiler: Compiler): void {
    const rootDir = this.options.rootDir || process.cwd()

    compiler.hooks.afterEnvironment.tap('VilsonWebpackPlugin', () => {
      const rule = {
        test: /\.(jsx?|tsx)$/,
        enforce: 'pre' as const,
        exclude: (file: string) => shouldExclude(file, rootDir),
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

    compiler.hooks.afterPlugins.tap('VilsonWebpackPlugin', () => {
      new webpack.DefinePlugin({
        __CARLOS_ROOT__: JSON.stringify(rootDir),
      }).apply(compiler)
    })
  }
}

export default vilsonLoader

if (typeof module !== 'undefined') {
  module.exports = Object.assign(vilsonLoader, {
    default: vilsonLoader,
    VilsonWebpackPlugin,
  })
}
