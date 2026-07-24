import type { IncomingMessage, ServerResponse } from 'http'
import fs from 'fs'
import path from 'path'
import launch from 'launch-editor'

interface MiddlewareOptions {
  editor?: string
  rootDir?: string
  endpoint?: string
}

interface SourceLocation {
  filePath: string
  line: number
  column: number
}

function parseSourceLocation(value: string): SourceLocation | null {
  const parts = value.split(':')
  if (parts.length < 3) return null

  const column = parseInt(parts[parts.length - 1], 10)
  const line = parseInt(parts[parts.length - 2], 10)
  const filePath = parts.slice(0, -2).join(':')

  if (!filePath || Number.isNaN(line) || Number.isNaN(column)) return null

  return { filePath, line, column }
}

function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>
) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

export function sourceLensMiddleware(options: MiddlewareOptions = {}) {
  const {
    editor,
    rootDir = process.cwd(),
    endpoint = '/__open-in-editor',
  } = options

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: IncomingMessage, res: ServerResponse, next?: (...args: any[]) => void) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    if (url.pathname !== endpoint) {
      if (next) return next()
      return
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { success: false, error: 'Method not allowed' })
      return
    }

    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      let file: string | null = null

      try {
        const parsed = JSON.parse(body)
        file = parsed.file
      } catch {
        file = url.searchParams.get('file')
      }

      if (!file) {
        sendJson(res, 400, { success: false, error: 'Missing file parameter' })
        return
      }

      const location = parseSourceLocation(file)
      if (!location) {
        sendJson(res, 400, { success: false, error: 'Invalid file location format' })
        return
      }

      const fullPath = path.resolve(rootDir, location.filePath)
      if (!fs.existsSync(fullPath)) {
        sendJson(res, 404, {
          success: false,
          error: `File not found: ${location.filePath}`,
        })
        return
      }

      const launchPath = `${fullPath}:${location.line}:${location.column}`
      let responded = false

      launch(launchPath, editor, (fileName: string, errorMsg: string | null) => {
        if (responded) return
        responded = true
        console.error(`[SourceLens] Failed to open ${fileName}: ${errorMsg}`)
        sendJson(res, 500, {
          success: false,
          error: errorMsg || `Failed to open ${fileName}`,
        })
      })

      setImmediate(() => {
        if (responded) return
        responded = true
        sendJson(res, 200, { success: true, file: launchPath })
      })
    })
  }
}

export function sourceLensExpressMiddleware(options: MiddlewareOptions = {}) {
  const handler = sourceLensMiddleware(options)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res: any, next: any) => handler(req, res, next)
}

export default sourceLensMiddleware
