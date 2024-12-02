import path, { resolve } from 'path';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig } from 'vite';

import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "/@": resolve(__dirname, "./src"),
    },
  },

  plugins: [],

  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },

  build: {
    outDir: "./dist",
    target: "modules",
    emptyOutDir: true,
    sourcemap: true,
    minify: mode === "development" ? false : "esbuild",
    reportCompressedSize: true,
    lib: {
      entry: {
        'index': path.resolve(__dirname, 'src/index.ts'),
        'components/index': path.resolve(__dirname, 'src/components/index.tsx'),
        'hooks/index': path.resolve(__dirname, 'src/hooks/index.ts')
      },
      formats: ['es']

      // entry: path.resolve(__dirname, "src/index.ts"),
      // formats: ["es"],
      // fileName: (format) => `index.${format === 'es' ? 'js' : format}`,
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        // Make sure to keep separate files for imports
        // entryFileNames: '[name].js',
        // chunkFileNames: '[name]-[hash].js',
        // assetFileNames: '[name]-[hash][extname]',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React"
        }
      },
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "@metapages/metapage"],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          tsconfig: './tsconfig.json',
          declaration: true,
          declarationDir: './dist',
          exclude: ['**/*.test.ts', '**/*.test.tsx'],
          sourceMap: true,
          outDir: "dist",
        }),
      ],
    },
  },
}));
