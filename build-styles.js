/* eslint-disable */
const overallStartTime = new Date().getTime();

const { join, parse } = require('path');
const { writeFile } = require('fs');
const autoprefixer = require('autoprefixer');
const sortMediaqueries = require('css-mqpacker-sort-mediaqueries');
const cssnano = require('cssnano');
const mqpacker = require('mqpacker');
const mkdirp = require('mkdirp');
const magicImporter = require('node-sass-magic-importer');
const sass = require('sass');
const postcss = require('postcss');

const inputDir = './src/client/styles/';
const outputDir = './dist/client/styles/';

const files = ['main.scss'];

async function write(path, contents) {
  return new Promise((resolve, reject) => {
    writeFile(path, contents, (err, result) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function render(filename) {
  const from = join(inputDir, filename);
  const to = join(outputDir, `${parse(filename).name}.css`);

  let sassResult;
  try {
    sassResult = sass.renderSync({
      file: from,
      outFile: to,
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
      includePaths: [join(inputDir, 'imports')],
      importer: magicImporter({
        cwd: __dirname,
        packagePrefix: '~'
      })
    });
  } catch (err) {
    throw err.formatted;
  }

  const postcssProcessor = postcss([
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
  ]);

  const postcssResult = await postcssProcessor.process(sassResult.css.toString(), { from, to, map: { inline: false } });
  await mkdirp(outputDir);
  await write(to, postcssResult.css);
  await write(to + '.map', postcssResult.map.toString());
}

async function processFiles() {
  for (const file of files) {
    const startTime = new Date().getTime();
    await render(file);
    console.log(`Compiled ${file} in ${(new Date().getTime() - startTime) / 1000}s.`);
  }
}

processFiles()
  .then(() => {
    console.log(`Built styles in ${(new Date().getTime() - overallStartTime) / 1000}s.`);
  })
  .catch(err => console.error(err));
