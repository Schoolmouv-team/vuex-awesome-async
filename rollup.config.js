import * as path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';

const name = 'vue-store-loading-state';

const builds = {
  'cjs-dev': {
    outFile: `${name}.js`,
    format: 'cjs',
    mode: 'development',
  },
  'cjs-prod': {
    outFile: `${name}.min.js`,
    format: 'cjs',
    mode: 'production',
  },
  'umd-dev': {
    outFile: `${name}.umd.js`,
    format: 'umd',
    mode: 'development',
  },
  'umd-prod': {
    outFile: `${name}.umd.min.js`,
    format: 'umd',
    mode: 'production',
  },
  es: {
    outFile: `${name}.module.js`,
    format: 'es',
    mode: 'development',
  },
};

function getAllBuilds() {
  return Object.keys(builds).map(key => genConfig(builds[key]));
}

function genConfig({ outFile, format, mode }) {
  const isProd = mode === 'production';
  return {
    input: './src/index.ts',
    output: {
      file: path.join('./dist', outFile),
      format: format,
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
      name: format === 'umd' ? name : undefined,
    },
    external: ['vue'],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      resolve(),
      replace({ 'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development') }),
      isProd && terser(),
    ].filter(Boolean),
  };
}

let buildConfig;

if (process.env.TARGET) {
  buildConfig = genConfig(builds[process.env.TARGET]);
} else {
  buildConfig = getAllBuilds();
}

export default buildConfig;