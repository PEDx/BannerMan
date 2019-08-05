const fs = require('fs');
const { resolve } = require('path');

const createBundleRenderer = require('vue-server-renderer')
  .createBundleRenderer;

class WebpackSkeletonPlugin {
  apply(compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.done.tapAsync(
      'WebpackSkeletonPlugin',
      (compilation, callback) => {
        const renderer = createBundleRenderer(
          resolve(__dirname, '../dist/skeleton.json'),
          {
            template: fs.readFileSync(
              resolve(__dirname, '../dist/index.html'),
              'utf-8'
            )
          }
        );

        renderer.renderToString({}, (err, html) => {
          fs.writeFileSync('index.html', html, 'utf-8');
        });
        callback();
      }
    );
  }
}
module.exports = WebpackSkeletonPlugin;
