import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];

export default {
  input: 'src/client/main.tsx',
  output: {
    sourcemap: true,
    dir: 'dist/client',
    format: 'es'
  },
  plugins: [
    resolve({
      extensions
    }),
    globals(),
    typescript({
      tsconfig: './tsconfig.client.json'
    }),
    babel({
      extensions,
      include: 'src/client/**/*.(ts|tsx)',
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    terser()
  ]
};
