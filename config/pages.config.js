'use strict';
const path = require('path');
module.exports = [
  {
    name: 'editor',
    title: '编辑器',
    entry: './src/editor/main.js',
    template: './src/editor/index.html',
    output: path.resolve(__dirname, '../dist/index.html')
  },
  {
    name: 'viewport',
    title: '视窗',
    entry: './src/viewport/main.js',
    template: './src/viewport/index.html',
    output: path.resolve(__dirname, '../dist/viewport.html')
  }
];
