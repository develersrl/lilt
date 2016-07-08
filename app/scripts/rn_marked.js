'use strict';

const marked = require('marked');


function RNRenderer(options) {
  ;
}


RNRenderer.prototype.code = function(code, lang, escaped) {
  console.log('\tcode');
  return '<Text>' + code + '</Text>';
};


RNRenderer.prototype.blockquote = function(quote) {
  console.log('\tblockquote');
  return '<Text>' + quote + '</Text>';
};


RNRenderer.prototype.html = function(html) {
  console.log('\thtml');
  return '<Text>' + html + '</Text>';
};


RNRenderer.prototype.heading = function(text, level, raw) {
  console.log('\theading');
  return "<Text style={{fontWeight: 'bold'}}>" + text + '</Text>';
};


RNRenderer.prototype.hr = function() {
  console.log('\thr');
  return '<Text>HorizontalLine</Text>';
};


RNRenderer.prototype.list = function(body, ordered) {
  console.log('\tlist');
  return '<Text>' + body + '</Text>';
};


RNRenderer.prototype.listitem = function(text) {
  console.log('\tlistitem');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.paragraph = function(text) {
  console.log('\tparagraph: ' + text);
  return '<View>' + text + '</View>';
};


RNRenderer.prototype.table = function(header, body) {
  console.log('\ttable');
  return '<Text>Table</Text>';
};


RNRenderer.prototype.tablerow = function(content) {
  console.log('\ttablerow');
  return '<Text>' + content + '</Text>';
};


RNRenderer.prototype.tablecell = function(content, flags) {
  console.log('\ttablecell');
  return '<Text>' + content + '</Text>';
};


RNRenderer.prototype.strong = function(text) {
  console.log('\tstrong');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.em = function(text) {
  console.log('\tem');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.codespan = function(text) {
  console.log('\tcodespan');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.br = function() {
  console.log('\tbr');
  return '<Text>Br</Text>';
};


RNRenderer.prototype.del = function(text) {
  console.log('\tdel');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.link = function(href, title, text) {
  console.log('\tlink');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.image = function(href, title, text) {
  console.log('\timage');
  return '<Text>' + text + '</Text>';
};


RNRenderer.prototype.text = function(text) {
  console.log('\ttext: ' + text);
  return '<Text>' + text + '</Text>';
};


marked.setOptions({
  renderer: new RNRenderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
});


module.exports = marked;
