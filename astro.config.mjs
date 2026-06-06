// @ts-check
import * as fs from 'node:fs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import opengraphImage from '@sumitgohil/astro-opengraph-image';
import tailwindcss from '@tailwindcss/vite';
import compressor from 'astro-compressor';
import favicons from 'astro-favicons';

// https://astro.build/config
export default defineConfig({
  site: 'https://mdresume.app',
  integrations: [
    react(),
    opengraphImage({
      background: '#06090d',
      width: 1200,
      height: 630,
      scale: 1,
      site: 'https://mdresume.app',
      fonts: [
        {
          name: 'Inter',
          weight: 400,
          style: 'normal',
          data: fs.readFileSync('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'),
        },
        {
          name: 'Inter',
          weight: 600,
          style: 'normal',
          data: fs.readFileSync('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff'),
        },
        {
          name: 'Inter',
          weight: 700,
          style: 'normal',
          data: fs.readFileSync('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'),
        },
        {
          name: 'JetBrains Mono',
          weight: 700,
          style: 'normal',
          data: fs.readFileSync('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff'),
        },
      ],
    }),
    compressor(),
    favicons({
      name: 'MDResume',
      short_name: 'MDResume',
    }),
  ],
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
