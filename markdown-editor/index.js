const fs = require('fs');
const marked = require('./ckeditor/plugins/markdown/js/marked');


/* ---------------- state --------------------------------------------------- */
// when the overlay text is specified the editor is hidden
let overlayText = 'Please select a document.';

// file path of markdown file currently being edited.
let currentMdFile = '';

// prev and selected node id in tree view
let prevNodeId = -1000;
let selNodeId = -1000;

let documentChanged = false;
let ignoreChangedEvent = false;
let selectedNodeData = null;
/* -------------------------------------------------------------------------- */


/* ---------------- support functions and variables ------------------------- */
// We need to simulate ckeditor actions to load/save markdown properly.
// These actions must be done one after another with some delay in order to
// avoid editor errors.
// This is a simple promise to wait for editor actions to be completed.
// eslint-disable-next-line no-unused-vars
const wait = () => new Promise((resolve, reject) => {
  setTimeout(resolve, 300);
});

// treeview object
let tree = null;

// timer id for same tree node reselection upon multiple clicks
let reselectTimerId = -1;

// shortcut method to obtain the ckeditor instance
const editor = () => CKEDITOR.instances.editor1;

// walk through a directory tree and return a JS object that will be used to
// initialize the treeview sidebar
const walk = (dir) => {
  const tree = [];
  fs.readdirSync(dir).forEach((f) => {
    const path = dir + '/' + f;
    if (fs.statSync(path).isDirectory())
      tree.push({ text: f, selectable: false, nodes: walk(path) });
    else if (f.endsWith('.md'))
      tree.push({
        text: f,  // tree node shown text
        orgText: f,  // original text (e.g. test.md)
        path,  // full path to markdown document
        icon: 'glyphicon glyphicon-file'
      });
  });
  return tree;
};

// obtain jQuery tree node object by node id
const getNode = (nodeId) => $('*[data-nodeid="' + nodeId + '"]');

// load markdown file inside the editor
const loadMarkdown = (fn) => {
  Promise.resolve()
    .then(() => {
      documentChanged = false;
      ignoreChangedEvent = true;
      currentMdFile = fn;
      overlayText = 'Loading..';
      editor().setMode('wysiwyg');
      update();
    })
    .then(wait)
    .then(() => editor().setData(marked(
      fs.readFileSync(fn, "utf-8"),
      { langPrefix: 'language-' }  // same setting used by ckeditor
    )))
    .then(wait)
    .then(() => {
      overlayText = '';
      ignoreChangedEvent = false;
      update();
    });
};

// save the current editor markdown content to file
const saveMarkdown = () => {
  if (currentMdFile !== '') {
    return Promise.resolve()
      .then(() => {
        overlayText = 'Saving..';
        editor().setMode('markdown');
      })
      .then(wait)
      .then(() => {
        // http://stackoverflow.com/questions/18106164
        const div = document.createElement('div');
        div.innerHTML = editor().getData();
        const unescapedData = (div.innerText || div.textContent || "");
        fs.writeFileSync(currentMdFile, unescapedData);
      })
      .then(wait)
      .then(() => editor().setMode('wysiwyg'))
      .then(wait)
      .then(() => {
        overlayText = '';
        documentChanged = false;
        update();
      });
  }
};

const switchDocument = (nodeData) => {
  prevNodeId = selNodeId;
  selNodeId = nodeData.nodeId;
  loadMarkdown(nodeData.path);  // calls the update() method
};
/* -------------------------------------------------------------------------- */


/* ---------------- events management --------------------------------------- */
const onDocumentChanged = () => {
  if (!ignoreChangedEvent) {
    documentChanged = true;
    update();
  }
};

const onSaveNo = () => switchDocument(selectedNodeData);
const onSaveYes = () => saveMarkdown().then(onSaveNo);

const onNodeSelected = (ev, data) => {
  // do nothing if node is a directory
  if (data.path) {
    // de-schedule same node reselection because the user chosed a new node
    clearTimeout(reselectTimerId);
    if (currentMdFile === data.path) {
      // nothing to do if selected document does not change
      update();
    }
    else {
      if (documentChanged) {
        selectedNodeData = data;
        $('#confirmModal').modal();
      }
      else {
        switchDocument(data);
      }
    }
  }
};

const onNodeUnselected = (ev, data) => {
  // schedule a selection of same node.. this is needed to reselect the
  // current node if user clicks on the same tree node
  reselectTimerId = setTimeout(() => onNodeSelected(ev, data));
};


// eslint-disable-next-line no-unused-vars
const ckeditorInit = () => {
  // this is a little hack: to prevent the editor to appear for an
  // instant during initialization phase we show the overlay
  $('#overlay')
    .html('Please select a document.')
    .css('visibility', 'visible');

  // it must be initialized here :(
  CKEDITOR.replace('editor1', {  // eslint-disable-line no-undef
    toolbarGroups: [
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'basicstyles'},
      { name: 'styles', groups: ['styles'] },
      // { name: 'others' },  // uncomment to show "Markdown" btn
    ],
    removeButtons: 'Underline,Subscript,Superscript,Strike,' +
        'Styles,Cut,Copy,Paste,PasteText,PasteFromWord',
    extraPlugins: 'markdown',
    format_tags: 'p;h1;h2;h3;pre',  // eslint-disable-line camelcase
    removeDialogTabs: 'image:advanced;link:advanced',
    width: '100%',
    removePlugins: 'elementspath,resize',
  })
  .on('change', onDocumentChanged);
};


// initialization
$(document).ready(() => {
  tree = $('#tree');
  tree.treeview({
    showBorder: false,
    color: "#428BCA",
    expandIcon: 'glyphicon glyphicon-folder-close',
    collapseIcon: 'glyphicon glyphicon-folder-open',
    data: walk('./testdir'),
    onNodeSelected,
    onNodeUnselected,
    onNodeCollapsed: update,
    onNodeExpanded: update,
    selectedColor: "#428BCA",
    selectedBackColor: "#F5F5F5",
  });
  $('#savebtn').click(saveMarkdown);
  $('#save-yes').click(onSaveYes);
  $('#save-no').click(onSaveNo);
  update();
});
/* -------------------------------------------------------------------------- */


/* ---------------- rendering ----------------------------------------------- */
const updateTree = () => {
  if (prevNodeId >= 0) {
    const treeNode = tree.treeview('getNode', prevNodeId);
    treeNode.text = treeNode.orgText;
    // the "revealNode" call forces the treeview refresh
    tree.treeview('revealNode', [prevNodeId, { silent: true }]);
    getNode(prevNodeId).css('fontWeight', 'normal');
  }
  if (selNodeId >= 0) {
    const treeNode = tree.treeview('getNode', selNodeId);
    treeNode.text = treeNode.orgText;
    if (documentChanged)
      treeNode.text += '*';
    // the "revealNode" call forces the treeview refresh
    tree.treeview('revealNode', [selNodeId, { silent: true }]);
    getNode(selNodeId).css('fontWeight', 'bold');
  }
};

const update = () => setTimeout(() => {
  if (overlayText !== '')
    $('#overlay').html(overlayText).css('visibility', 'visible');
  else
    $('#overlay').css('visibility', 'hidden');
  updateTree();
}, 0);
/* -------------------------------------------------------------------------- */
