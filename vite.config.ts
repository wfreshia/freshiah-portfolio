import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Portfolio runs on its own port so it does not clash with other projects (Vite's default is 5173).
export default defineConfig({ plugins: [react()], server: { port: 5180, strictPort: true } })
