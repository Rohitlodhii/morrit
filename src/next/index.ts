import path from 'path'

interface NextConfig {
  webpack?: (config: any, options: any) => any
  [key: string]: any
}

function shouldExclude(file: string, rootDir: string): boolean {
  const relativePath = path.relative(rootDir, file)
  return (
    file.includes('node_modules') ||
    file.includes(`${path.sep}.next${path.sep}`) ||
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath)
  )
}

export function withMorrit(nextConfig: NextConfig = {}): NextConfig {
  return {
    ...nextConfig,
    webpack: (config: any, options: any) => {
      const { dev } = options
      const rootDir = process.cwd()

      if (nextConfig.webpack) {
        config = nextConfig.webpack(config, options)
      }

      if (dev) {
        config.module.rules.unshift({
          test: /\.(jsx?|tsx)$/,
          enforce: 'pre',
          exclude: (file: string) => shouldExclude(file, rootDir),
          use: [
            {
              loader: path.resolve(__dirname, '../webpack-plugin/index.js'),
              options: {
                rootDir,
                attributeName: 'data-morrit',
              },
            },
          ],
        })

        const webpack = require('webpack')
        config.plugins.push(
          new webpack.DefinePlugin({
            __MORRIT_ROOT__: JSON.stringify(rootDir),
          })
        )
      }

      return config
    },
  }
}
