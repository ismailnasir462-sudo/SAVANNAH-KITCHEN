import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access across local networks
    allowedHosts: [
      'cascade-sappiness-stays.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app'
    ]
  }
});