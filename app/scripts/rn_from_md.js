'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const rnMarked = require('./rn_marked');


function main() {
  // collect all markdown files inside "content" folder
  const contentDir = path.join(__dirname, '..', 'content');
  let names = fs.readdirSync(contentDir);
  names = names.filter((v) => v.endsWith('.md'));

  // configure nunjucks to fetch templates from this script's directory
  nunjucks.configure(__dirname);

  // compute output js directory
  const genDir = path.join(__dirname, '..', 'js', 'gen');

  for (let i = 0; i < names.length; ++i) {
    // read markdown from input file
    const inputFn = path.join(contentDir, names[i]);
    const markdown = fs.readFileSync(inputFn, 'utf-8');

    // generate react-native component
    const comp = nunjucks.render('md_component.njk', {
      markdownContent: rnMarked(markdown),
    });

    // write output js file
    const basename = path.basename(names[i], '.md');
    const outputFn = path.join(genDir, basename + '.js');
    fs.writeFileSync(outputFn, comp);

    // eslint-disable-next-line no-console
    console.log(names[i] + ' -> ' + basename + '.js');
  }
}

main();
