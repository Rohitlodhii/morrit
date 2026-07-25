export const installationPrompt = `        You are integrating Morrit, a compile-time React source inspector, into my project.

        Your task is to install and configure Morrit based on my existing project setup.

        Instructions:
        1. Detect whether this project uses Vite, Next.js (App Router), Webpack, or a standalone Babel configuration.
        2. Install the latest \`morrit\` package.
        3. Configure the correct plugin for the detected framework.
        4. Add the \`MorritInspector\` component to the correct entry file:
        - Vite → \`src/main.tsx\` or \`src/App.tsx\`
        - Next.js → \`app/layout.tsx\`
        5. Preserve all existing configuration and merge changes instead of overwriting files.
        6. Do not modify production behavior. Morrit should only run in development.
        7. After setup, verify that pressing \`Ctrl + Shift + I\` enables the inspector and clicking any element opens its source in VS Code.

        Reference:

        Vite
        - Install: \`npm install morrit\`
        - Import: \`import morrit from 'morrit/vite-plugin'\`
        - Add to \`plugins\`:
        \`morrit({ rootDir: __dirname })\`
        - Add:
        \`optimizeDeps: { include: ['morrit'] }\`
        - Render:
        \`import { MorritInspector } from 'morrit'\`

        Next.js (App Router)
        - Install: \`npm install morrit\`
        - Wrap the config:
        \`const { withMorrit } = require('morrit/next')\`
        \`module.exports = withMorrit(nextConfig)\`
        - Render:
        \`import { MorritInspector } from 'morrit/next/client'\`
        inside \`app/layout.tsx\`

        Webpack
        - Add:
        \`new MorritWebpackPlugin({ rootDir: __dirname })\`

        Babel
        - Add:
        \`['morrit/babel-plugin', { attributeName: 'data-morrit', relativeTo: __dirname }]\`

        When you're done, explain what files were modified and why.
`;