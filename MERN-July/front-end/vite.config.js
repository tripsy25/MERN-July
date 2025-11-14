import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server:{
  //   proxy:{
  //     '/api':{
  //       target:'https://j9f46s74-5173.inc1.devtunnels.ms',
  //       changeOrigin: true,
  //     }
  //   }
  // }
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
},

})
