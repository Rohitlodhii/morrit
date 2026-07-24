# termis

Compile-time React source inspector for **Vite** and **Next.js**. Click any UI element in development to open its source file in VS Code — zero server setup.

## How it works

termis injects a `data-termis` attribute into every JSX element at build time with the file path and line number. When inspector mode is active, clicking an element opens `vscode://file/<path>:<line>` directly in your browser — no API routes, no middleware, no Babel config.

---

## Vite

### 1. Install

```bash
npm install termis
```

### 2. Add the plugin

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import termis from 'termis/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    termis({
      rootDir: __dirname,
    }),
  ],
  optimizeDeps: {
    include: ['termis'],
  },
})
```

### 3. Add the inspector

```tsx
// src/main.tsx or src/App.tsx
import { TermisInspector } from 'termis'

function App() {
  return (
    <>
      {/* your app */}
      <TermisInspector />
    </>
  )
}
```

Toggle the inspector with **Ctrl+Shift+I**, then click any element to open its source.

---

## Next.js (App Router)

### 1. Install

```bash
npm install termis
```

### 2. Wrap your Next.js config

```js
// next.config.js
const { withTermis } = require('termis/next')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config
}

module.exports = withTermis(nextConfig)
```

### 3. Add the inspector to your layout

```tsx
// app/layout.tsx
import { TermisInspector } from 'termis/next/client'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <TermisInspector />
      </body>
    </html>
  )
}
```

That's it. No Babel config, no API routes, no custom server. SWC stays enabled.

---

## Usage

Once the inspector is active (click the floating button or press **Ctrl+Shift+I**):

1. **Hover** over any element to see its source file and line in a tooltip
2. **Click** an element to open a popup with the full path
3. **Copy** the path or **Open in VS Code** from the popup

The floating button shows a random emoji and is only rendered in development mode.

---

## Webpack (non-Next.js)

```js
const { TermisWebpackPlugin } = require('termis/webpack-plugin')

module.exports = {
  plugins: [
    new TermisWebpackPlugin({
      rootDir: __dirname,
    }),
  ],
}
```

---

## Babel (standalone)

```js
// babel.config.js
module.exports = {
  plugins: [
    ['termis/babel-plugin', {
      attributeName: 'data-termis',
      relativeTo: __dirname,
    }],
  ],
}
```

---

## Options

All plugins accept these options:

| Option | Type | Default | Description |
|---|---|---|---|
| `attributeName` | `string` | `'data-termis'` | HTML attribute name for source metadata |
| `rootDir` | `string` | `process.cwd()` | Project root for computing relative paths |
| `exclude` | `string[]` | `['Fragment', 'React.Fragment']` | Tag names to skip |

---

## Why termis?

- **No server middleware** — uses `vscode://file/` protocol directly from the browser
- **No Babel config** in Next.js — works as a webpack loader, preserves SWC
- **Dead simple** — two lines of setup for Vite or Next.js
- **Dev-only** — never runs in production
