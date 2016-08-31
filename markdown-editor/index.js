const fs = require('fs');
const path = require('path');
const marked = require('marked');
const remote = require('electron').remote;

/* ---------------- state --------------------------------------------------- */
// default markdown directory
const defaultMarkdownDir = 'markdown';

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

// remote process variable
const remoteProcess = remote.getGlobal('sharedArgs').proc;

// shortcut method to obtain the ckeditor instance
const editor = () => CKEDITOR.instances.editor1;

// app environment detection (https://github.com/electron/electron/pull/5421)
const isProdEnvironment = () => (remoteProcess.defaultApp === undefined);


// return the markdown directory
const getMarkdownDir = () => {
  // obtain command line arguments
  const args = remoteProcess.argv.slice(isProdEnvironment() ? 1 : 2);

  if (args.length === 0)
    return defaultMarkdownDir;
  else if (args.length > 1)
    console.error('wrong arguments');  // eslint-disable-line no-console

  // we expect the markdown dir as the only parameter
  return args[0];
};


// walk through a directory tree and return a JS object that will be used to
// initialize the treeview sidebar
const walk = (dir) => {
  const tree = [];

  try {
    fs.statSync(dir).isDirectory();
  }
  catch (err) {
    overlayText = 'Cannot find markdown directory';
    return tree;
  }

  const contentDirPath = path.join(dir, 'Contenuti');
  const glossaryDirPath = path.join(dir, 'Glossario');
  // We know we have 2 top level nodes: Contents and Glossary
  tree.push({
    text: path.basename(contentDirPath),
    selectable: false,
    nodes: getTreeNodes(contentDirPath)
  })

  tree.push({
    text: path.basename(glossaryDirPath),
    selectable: false,
    nodes: {}
  })

  return tree;
};

const getTreeNodes = (dir) => {
  const nodes = [];
  const pageDirs = fs.readdirSync(dir);

  pageDirs.forEach((pageDir) => {
    const fullDirPath = path.join(dir, pageDir);
    const jsonObj = require(path.resolve(path.join(fullDirPath, 'page.json')));
    nodes.push({
      text: jsonObj.title,
      orgText: jsonObj.title,
      path: path.join(fullDirPath, 'content.md'),
      formData: {
        title: jsonObj.title,
        headerImage: jsonObj.headerImage,
        pdfFile: jsonObj.pdfFile,
        sharedText: jsonObj.sharedText
      },
      icon: 'glyphicon glyphicon-file'
    });
  });

  return nodes;
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

// load title, shared text and header image info inside form
const loadFormData = (formData, pageDir) => {
  $('#title').val(formData.title);
  $('#shared-text').val(formData.sharedText);

  if (formData.pdfFile) {
    $('#pdf-name').text(path.basename(formData.pdfFile));
    $('#pdf-name').removeClass('hidden');
  }

  if (formData.headerImage) {
    $('#header-pic').attr('src', path.join(pageDir, formData.headerImage));
    $('#header-image-container').removeClass('hidden');
  } else {
    $('#header-pic').attr('src', '');
    $('#header-image-container').addClass('hidden');
  }
};

// save the current editor markdown content to file
const savePage = () => {
  if (currentMdFile !== '') {
    return Promise.resolve()
      .then(() => {
        overlayText = 'Saving..';
        editor().setMode('markdown');
        update();
      })
      .then(wait)
      .then(() => {
        // http://stackoverflow.com/questions/18106164
        // Write the markdown file
        const div = document.createElement('div');
        div.innerHTML = editor().getData();
        const unescapedData = (div.innerText || div.textContent || "");
        fs.writeFileSync(currentMdFile, unescapedData);

        // First, copy header image and pdf in page dir
        const pageDir = path.dirname(currentMdFile);
        const headerPath = $('#header-pic').attr('src');
        const pdfFile = $('#pdf-input')[0].files[0];

        if (headerPath) {
          // We need to check if the header image is the same. If it
          const currJson = require(path.resolve(path.join(pageDir, 'page.json')));
          const currImagePath = path.resolve(path.join(pageDir, currJson.headerImage));
          const newImagePath = path.resolve(headerPath);

          if (currImagePath !== newImagePath) {
            copyToDir(headerPath, pageDir);
          }
        }

        if (pdfFile) {
          copyToDir(pdfFile.path, pageDir);
          $('#pdf-input').val(''); // Reset the input field to avod copying the
                                   // same file every time save is clicked
        }

        // Then, write page.json
        const jsonObj = {
          title: $('#title').val(),
          sharedText: $('#shared-text').val(),
          pdfFile: (pdfFile) ? path.basename(pdfFile.path) : $('#pdf-name').text(),
          headerImage: path.basename(headerPath)
        };
        fs.writeFileSync(path.join(pageDir, 'page.json'), JSON.stringify(jsonObj));
        updateNodeData(jsonObj);
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

const copyToDir = (sourceFile, targetDir) => {
  const sourceName = path.basename(sourceFile);
  const targetFile = path.join(path.resolve(targetDir), sourceName);

  const inStream = fs.createReadStream(sourceFile);
  const outStream = fs.createWriteStream(targetFile);

  inStream.on('error', () => {
    // TODO missing proper error handling
    console.error("Error reading file", sourceFile);
  });

  outStream.on('error', () => {
    // TODO missing proper error handling
    console.error("Error writing file", targetFile);
  });

  inStream.pipe(outStream);
};

/* When clicking on a node in the tree, the info to display is fetched from the
 * node itself, not from the disk. Info is fetched from disk only at startup.
 * For this reason, when we modify something in the form, we must also update
 * the selected tree node with the new info, to avoid having to reread the full
 * tree from disk.
 */
const updateNodeData = (obj) => {
    const treeNode = tree.treeview('getNode', selNodeId);
    treeNode.orgText = obj.title;
    treeNode.formData.title = obj.title;
    treeNode.formData.pdfFile = obj.pdfFile;
    treeNode.formData.headerImage = obj.headerImage;
};

const switchDocument = (nodeData) => {
  prevNodeId = selNodeId;
  selNodeId = nodeData.nodeId;
  loadMarkdown(nodeData.path);  // calls the update() method
  loadFormData(nodeData.formData, path.dirname(nodeData.path));
};
/* -------------------------------------------------------------------------- */


/* ---------------- events management --------------------------------------- */
const onDocumentChanged = () => {
  if (!ignoreChangedEvent) {
    documentChanged = true;
    update();
  }
};

const onHeaderImageChanged = () => {
  const selectedImage = $('#header-image')[0].files[0].path;
  $('#header-pic').attr('src', selectedImage);
  $('#header-image-container').removeClass('hidden');
};

const onPdfChanged = () => {
  const pdfPath = $('#pdf-input')[0].files[0].path;
  const pdfName = path.basename(pdfPath);
  $('#pdf-name').text(pdfName);
  $('#pdf-name').removeClass('hidden');
};

const onSaveNo = () => switchDocument(selectedNodeData);
const onSaveYes = () => savePage().then(onSaveNo);

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
    data: walk(getMarkdownDir()),
    onNodeSelected,
    onNodeUnselected,
    onNodeCollapsed: update,
    onNodeExpanded: update,
    selectedColor: "#428BCA",
    selectedBackColor: "#F5F5F5",
  });
  connectEvents();
  update();
});

const connectEvents = () => {
  $('#savebtn').click(savePage);
  $('#save-yes').click(onSaveYes);
  $('#save-no').click(onSaveNo);
  $('#title').on('input', onDocumentChanged);
  $('#shared-text').on('input', onDocumentChanged);
  $('#header-image').on('change', onDocumentChanged);
  $('#pdf-input').on('change', onDocumentChanged);
  $('#pdf-input').on('change', onPdfChanged);
  $('#header-image').on('change', onHeaderImageChanged);
};
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
