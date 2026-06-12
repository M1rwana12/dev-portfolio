import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — відносні шляхи, щоб збірка працювала на GitHub Pages
// незалежно від назви репозиторію
export default defineConfig({
  plugins: [react()],
  base: './',
});
