import type { PluginObj, PluginPass } from '@babel/core'
import type { JSXAttribute } from '@babel/types'
import * as t from '@babel/types'
import path from 'path'

interface BabelPluginOptions {
  attributeName?: string
  relativeTo?: string
  exclude?: string[]
  filename?: string
}

export default function vilsonBabelPlugin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _api: any,
  options: BabelPluginOptions = {}
): PluginObj {
  const {
    attributeName = 'data-vilson',
    relativeTo = process.cwd(),
    exclude = ['Fragment', 'React.Fragment'],
    filename: optFilename,
  } = options

  const excludeSet = new Set(exclude)

  return {
    name: 'vilson',
    visitor: {
      JSXOpeningElement(p, state) {
        const node = p.node
        if (!t.isJSXOpeningElement(node)) return

        const st = state as PluginPass & { file?: { opts?: { filename?: string } } }
        const filename = optFilename || st.file?.opts?.filename

        if (!filename) return

        const name = node.name
        const tagName = t.isJSXIdentifier(name)
          ? name.name
          : t.isJSXMemberExpression(name)
            ? `${t.isJSXIdentifier(name.object) ? name.object.name : ''}.${t.isJSXIdentifier(name.property) ? name.property.name : ''}`
            : ''

        if (excludeSet.has(tagName)) return

        const hasExistingAttribute = node.attributes.some(
          (attr): attr is JSXAttribute =>
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === attributeName
        )
        if (hasExistingAttribute) return

        const line = node.loc?.start?.line ?? 0
        const col = node.loc?.start?.column ?? 0

        let relativePath = path.relative(relativeTo, filename)
        if (relativePath.startsWith('..')) {
          relativePath = filename
        }
        relativePath = relativePath.replace(/\\/g, '/')

        const value = `${relativePath}:${line}:${col}`

        node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier(attributeName),
            t.stringLiteral(value)
          )
        )
      },
    },
  }
}
