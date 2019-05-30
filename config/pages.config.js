'use strict';
const path = require('path');
module.exports = [
  {
    name: 'editer',
    title: '编辑器',
    entry: './src/main.js',
    template: './index.html',
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
