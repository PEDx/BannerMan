const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackSkeletonPlugin = require('./webpack-skeleton-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  target: 'node',
  entry: {
    skeleton: './src/skeleton/skeleton.entry.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new VueLoaderPlugin(),
    new VueSSRServerPlugin({
      filename: 'skeleton.json'
    }),
    new WebpackSkeletonPlugin()
  ]
};
