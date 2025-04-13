  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react-swc'
  import tailwindcss from '@tailwindcss/vite'

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react(), tailwindcss()],
    
    server: {
      port:5173,
      host: true, // Permite conexiones externas
      cors: true, // Habilita CORS
      strictPort: true,
      allowedHosts: ['.trycloudflare.com'], // Permite cualquier subdominio de trycloudflare
    }
  })
