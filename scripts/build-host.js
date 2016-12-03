'use strict';

const fs = require('fs');
const babel = require('babel-core');

const ghostframe = babel.transformFileSync(
  './lib/host/ghostframe.js',
  {
    presets: ['es2015', 'babili'],
    comments: false,
  }
);

let html = fs.readFileSync(
  './lib/host/index.html',
  { encoding: 'utf8' }
);

html = html.replace('GHOSTFRAME', ghostframe.code);

fs.writeFileSync('./dist/host/index.html', html);
