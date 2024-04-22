import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig(() => {
   return {
      plugins: [
         react(),
         svgr(),
         commonjs({
            filter(id) {
               if (['ckeditor5/build/ckeditor.js'].includes(id)) {
                  return true;
               }
            },
         }),
      ],
      resolve: {
         alias: {
            '@': path.resolve(__dirname, './src'),
         },
      },
      optimizeDeps: {
         include: ['ckeditor5-custom-build'],
      },
      build: {
         commonjsOptions: { exclude: ['ckeditor5-custom-build'] },
      },
   };
});

//cd ckeditor5 && rm -rf node_modules && npm install && npm run build && cd .. && npm i ckeditor5-custom-build &&
