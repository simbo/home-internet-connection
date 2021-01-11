/* eslint-disable @typescript-eslint/no-require-imports */
const autoprefixer = require('autoprefixer');
const sortMediaqueries = require('css-mqpacker-sort-mediaqueries');
const cssnano = require('cssnano');
const mqpacker = require('mqpacker');
const easyImport = require('postcss-easy-import');

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-scss',
  map: {
    inline: false
  },
  plugins: [
    easyImport(),
    autoprefixer({
      remove: false
    }),
    mqpacker({
      sort: sortMediaqueries
    }),
    cssnano({
      preset: [
        'default',
        {
          zindex: false
        }
      ]
    })
  ]
};
