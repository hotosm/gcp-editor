#!/usr/bin/env node

import esbuild from 'esbuild';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';

esbuild
  .build({
    entryPoints: ['src/gcp-editor.ts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    splitting: true,
    treeShaking: true,
    format: 'esm',
    loader: {
      '.png': 'dataurl',
      '.svg': 'dataurl',
      '.gif': 'dataurl',
      '.csv': 'dataurl',
    },
    external: ['ol', 'lit*', '@lit/*'],
    plugins: [tailwindPlugin()],
  })
  .catch(() => process.exit(1));
