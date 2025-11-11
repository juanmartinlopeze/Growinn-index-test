import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
            '/encuesta': 'http://localhost:3000',
            '/enviar-correos': 'http://localhost:3000',
            '/areas': 'http://localhost:3000',
            '/cargos': 'http://localhost:3000',
            '/subcargos': 'http://localhost:3000',
            '/empresas': 'http://localhost:3000',
            '/usuarios': 'http://localhost:3000',
            '/validate-token': 'http://localhost:3000',
        },
    },
})
