import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — відносні шляхи, щоб збірка працювала на GitHub Pages
// незалежно від назви репозиторію
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        // three + R3F + postprocessing — окремий важкий chunk,
        // вантажиться лениво лише коли сцена справді потрібна
        manualChunks(id) {
          if (
            /node_modules\/(three|@react-three|postprocessing|gsap)\//.test(id)
          ) {
            return 'three';
          }
        },
      },
    },
  },
});
