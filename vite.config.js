import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'src', // your source files
  build: {
    outDir: '../dist', // compiled bundle goes here
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.js') // entry file
      },
      output: {
        format: 'iife', // Immediately Invoked Function Expression for browsers
        name: 'UbiqitumDashboard', // attaches to window.UbiqitumDashboard
        entryFileNames: 'bundle.js'
      }
    }
  }
})
