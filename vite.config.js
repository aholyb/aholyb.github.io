import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    // Cypress specs live in cypress/ and run against a real browser.
    exclude: ['node_modules', 'dist', 'cypress'],
    // Process CSS Modules so components get readable class names in assertions.
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
})
