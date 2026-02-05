import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background.ts"),
        content: resolve(__dirname, "src/content.ts"),
        injected: resolve(__dirname, "src/injected/mount.tsx"),
        popup: resolve(__dirname, "src/popup/Popup.tsx"),
        options: resolve(__dirname, "src/options/Options.tsx")
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]"
      }
    }
  }
})
