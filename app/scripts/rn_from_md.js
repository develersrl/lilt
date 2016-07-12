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

  // compute output js directory and create it if it is not already there
  const genDir = path.join(__dirname, '..', 'js', 'markdown');
  if (!fs.existsSync(genDir)) {
    fs.mkdirSync(genDir);
  }

  const comps = [];

  // generate component classes
  for (let i = 0; i < names.length; ++i) {
    // read markdown from input file
    const inputFn = path.join(contentDir, names[i]);
    const markdown = fs.readFileSync(inputFn, 'utf-8');

    // generate react-native component
    const basename = path.basename(names[i], '.md').toLowerCase();
    const compClass = basename.charAt(0).toUpperCase() + basename.slice(1);

    const comp = nunjucks.render('gen_component.njk', {
      className: compClass,
      markdownContent: rnMarked(markdown),
    });

    // write output js file
    const outputFn = path.join(genDir, basename + '.js');
    fs.writeFileSync(outputFn, comp);

    // eslint-disable-next-line no-console
    console.log(names[i] + ' -> ' + basename + '.js');

    comps.push([basename, compClass]);
  }

  // generate index.js file
  let imports = '', compClasses = '';
  for (let i = 0; i < comps.length; ++i) {
    if (i > 0) {
      imports += '\n';
      compClasses += ', ';
    }

    imports += 'import ' + comps[i][1] + " from './" + comps[i][0] + "';";
    compClasses += comps[i][1];
  }

  const genIndex = nunjucks.render('gen_index.njk', { imports, compClasses });
  const outputIndexFn = path.join(genDir, 'index.js');
  fs.writeFileSync(outputIndexFn, genIndex);
}

main();
