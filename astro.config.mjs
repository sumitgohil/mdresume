// @ts-check
import * as fs from 'node:fs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import opengraphImage from '@sumitgohil/astro-opengraph-image';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mdresume.dev',
  integrations: [
    react(),
    opengraphImage({
      background: '#06090d',
      width: 1200,
      height: 630,
      scale: 1,
      site: 'https://mdresume.dev',
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
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
