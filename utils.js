const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { SWCMinifyPlugin } = require('swc-webpack-plugin');

const pluginMapping = {
  terser: TerserPlugin,
  esbuild: ESBuildMinifyPlugin,
  swc: SWCMinifyPlugin,
};

const getWpConfig = (name, { entry, pluginOptions = {} } = {}) => {
  return {
    mode: 'production',
    bail: true,
    entry,
    output: { path: path.resolve(__dirname, 'out'), filename: `[name]-${name}.js` },
    optimization: {
      minimize: true,
      minimizer: [new pluginMapping[name](pluginOptions)],
    },
  };
};

const largeTerserCompiler = webpack(
  getWpConfig('terser', {
    entry: { 'large-sample': path.resolve(__dirname, 'large-sample.js') },
    pluginOptions: { extractComments: false },
  }),
);
const largeESBuildCompiler = webpack(
  getWpConfig('esbuild', {
    entry: { 'large-sample': path.resolve(__dirname, 'large-sample.js') },
    pluginOptions: { target: 'es2015' },
  }),
);
const largeSWCCompiler = webpack(
  getWpConfig('swc', {
    entry: { 'large-sample': path.resolve(__dirname, 'large-sample.js') },
    pluginOptions: { jsc: { target: 'es2015' } },
  }),
);

const mediumTerserCompiler = webpack(
  getWpConfig('terser', {
    entry: { 'medium-sample': path.resolve(__dirname, 'medium-sample.js') },
    pluginOptions: { extractComments: false },
  }),
);
const mediumESBuildCompiler = webpack(
  getWpConfig('esbuild', {
    entry: { 'medium-sample': path.resolve(__dirname, 'medium-sample.js') },
    pluginOptions: { target: 'es2015' },
  }),
);
const mediumSWCCompiler = webpack(
  getWpConfig('swc', {
    entry: { 'medium-sample': path.resolve(__dirname, 'medium-sample.js') },
    pluginOptions: { jsc: { target: 'es2015' } },
  }),
);

exports.largeCases = [
  [
    'esbuild',
    deferred => {
      largeESBuildCompiler.run(() => {
        deferred.resolve();
      });
    },
    { defer: true },
  ],
  [
    'swc',
    deferred => {
      largeSWCCompiler.run(() => {
        deferred.resolve();
      });
    },
    { defer: true },
  ],
  [
    'terser',
    deferred => {
      largeTerserCompiler.run(() => {
        deferred.resolve();
      });
    },
    { defer: true },
  ],
];

exports.mediumCases = [
  [
    'esbuild',
    deferred => {
      mediumESBuildCompiler.run(() => {
        deferred.resolve();
      });
    },
    { defer: true },
  ],
  [
    'swc',
    deferred => {
      mediumSWCCompiler.run(() => {
        deferred.resolve();
      });
    },
    { defer: true },
  ],
  [
    'terser',
    deferred => {
      mediumTerserCompiler.run(() => {
        deferred.resolve();
      });
    },
    { defer: true },
  ],
];
