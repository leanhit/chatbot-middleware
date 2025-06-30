import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Cho phép truy cập từ mạng ngoài
    allowedHosts: ['admin.traloitudong.com'], // 👈 Thêm domain được phép truy cập
    proxy: {
      '/api': 'http://localhost:3000',
    }
  }
})
