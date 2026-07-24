export interface SourceLensOptions {
  attributeName?: string
  rootDir?: string
  pathType?: 'relative' | 'absolute'
  exclude?: string[]
  stripInProduction?: boolean
  editor?: string
  endpoint?: string
}
