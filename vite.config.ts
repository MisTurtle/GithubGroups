import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        side_panel: "pages/side_panel.html",
        welcome: "pages/welcome.html",
        settings: "pages/settings.html",

        background: "src/background/index.ts",
        contentLoader: "src/content/loader.ts",
        content: "src/content/content.ts"
      },
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: 'assets/[name][extname]'
      }
    },
    outDir: "dist"
  },
  plugins: [react()],
})
