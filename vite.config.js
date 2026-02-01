import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'UbiqitumDashboard',
      fileName: () => 'ubiqitum-dashboard.bundle.js'
    },
    rollupOptions: {
      external: ['chart.js'],
      output: {
        globals: {
          'chart.js': 'Chart'
        }
      }
    }
  }
});

