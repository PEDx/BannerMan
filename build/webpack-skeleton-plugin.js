const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
// const cheerio = require('cheerio');
const ora = require('ora');
const createBundleRenderer = require('vue-server-renderer')
  .createBundleRenderer;

const config = {
  target: 'node',
  entry: {
    skeleton: './src/editor/skeleton/skeleton.entry.js'
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
    })
  ]
};

class WebpackSkeletonPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('WebpackSkeletonPlugin', compilation => {
      console.log('The compiler is starting a new compilation...');
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'WebpackSkeletonPlugin', // <-- Set a meaningful name here for stacktraces
        (data, callback) => {
          webpack(config, (err, stats) => {
            // console.log(stats);
            genSkeletonHtml().then(skeletonHtml => {
              data.html = skeletonHtml;
              callback(null, data);
            });
          });
        }
      );
    });
  }
}
function genSkeletonHtml() {
  const _html = '';
  const renderer = createBundleRenderer(
    resolve(__dirname, '../dist/skeleton.json'),
    {
      template: fs.readFileSync(
        resolve(__dirname, '../src/editor/index.html'),
        'utf-8'
      )
    }
  );

  return new Promise((resolve, reject) => {
    renderer.renderToString({}, (err, html) => {
      if (err) reject(err);
      resolve(html);
    });
  });
}
module.exports = WebpackSkeletonPlugin;
