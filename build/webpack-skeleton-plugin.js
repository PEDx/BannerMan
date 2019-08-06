const fs = require('fs');

const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

const createBundleRenderer = require('vue-server-renderer')
  .createBundleRenderer;

const config = (entry, output) => {
  const _obj = {};
  _obj[entry.name] = entry.path;
  return {
    target: 'node',
    entry: _obj,
    output: {
      path: output,
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
        filename: `skeleton.${entry.name}.json`
      })
    ]
  };
};

class VueSkeletonWebpackPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('VueSkeletonWebpackPlugin', compilation => {
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'VueSkeletonWebpackPlugin', // <-- Set a meaningful name here for stacktraces
        (data, callback) => {
          const htmlPluginOption = data.plugin.options;
          if (!this.options.entry[htmlPluginOption.name]) {
            callback(null, data);
            return;
          }
          webpack(
            config(
              {
                name: htmlPluginOption.name,
                path: this.options.entry[htmlPluginOption.name]
              },
              this.options.output
            ),
            (err, stats) => {
              // console.log(stats);
              genSkeletonHtml(
                htmlPluginOption.name,
                htmlPluginOption.template.split('!')[1],
                this.options.output
              ).then(skeletonHtml => {
                data.html = skeletonHtml;
                callback(null, data);
              });
            }
          );
        }
      );
    });
  }
}
function genSkeletonHtml(name, htmlPath, output) {
  const _html = '';
  const renderer = createBundleRenderer(`${output}/skeleton.${name}.json`, {
    template: fs.readFileSync(htmlPath, 'utf-8')
  });

  return new Promise((resolve, reject) => {
    renderer.renderToString({}, (err, html) => {
      if (err) reject(err);
      resolve(html);
    });
  });
}
module.exports = VueSkeletonWebpackPlugin;
