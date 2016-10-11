const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const remote = require('electron').remote;
const uuid = require('node-uuid');
const storage = require('electron-json-config');

const {
  wait,
  editor,
  isProdEnvironment,
  isMac,
  relativeToAbsolute,
  copyFile,
} = require('./misc');

const { ckInit } = require('./ckeditor_utils');


/* ---------------- state --------------------------------------------------- */
// default markdown directory
const defaultMarkdownDir = 'appdata';

// when the overlay text is specified the editor is hidden
let overlayText = "Scegli un documento oppure";

// file path of markdown file currently being edited.
let currentMdFile = '';

// prev and selected node id in tree view
let prevNodeId = -1000;
let selNodeId = -1000;

let documentChanged = false;
let ignoreChangedEvent = false;
let selectedNodeData = null;

// Add further templates here
const templates = [
  require('./contents_template'),
  require('./glossary_template'),
  require('./structure_template'),
];
/* -------------------------------------------------------------------------- */


/* ---------------- support functions and variables ------------------------- */
// treeview object
let tree = null;

// timer id for same tree node reselection upon multiple clicks
let reselectTimerId = -1;

// remote process variable
const shared = remote.getGlobal('sharedArgs');
const remoteProcess = shared.proc;

const getDefaultMarkdownDir = () => {
  if (isProdEnvironment()) {
    if (isMac()) {
      // under mac this script is inside app folder/Content/ecc...
      // so we have to backtrack a bit to cd to the right folder
      return path.join(
        __dirname, '..', '..', '..', '..', '..', defaultMarkdownDir
        );
    }
    else {
      // windows
      return path.join(
        __dirname, '..', '..', '..', defaultMarkdownDir
        );
    }
  }
  else {
    // in development environment the data dir must be placed inside
    // this script's directory
    return path.join(__dirname, defaultMarkdownDir);
  }
};


// return the markdown directory
const getMarkdownDir = () => {
  // obtain command line arguments
  const args = remoteProcess.argv.slice(isProdEnvironment() ? 1 : 2);

  if (args.length === 0) {
    // Try to read the input directory from storage (application settings)
    if (storage.has('datadir')) {
      // eslint-disable-next-line no-console
      console.info('Reading data directory from application settings');
      return storage.get('datadir', '');
    }

    // Try to read the input directory from environment variable
    const envdir = remoteProcess.env.LILT_EDITOR_DATA_DIR;
    if (envdir !== undefined) {
      // eslint-disable-next-line no-console
      console.info('Reading data directory from environment variable');
      return envdir;
    }

    // Final choice: use default data directory
    return getDefaultMarkdownDir();
  }

  if (args.length > 1)
    console.error('wrong arguments');  // eslint-disable-line no-console

  // we expect the markdown dir as the only parameter
  return args[0];
};


/**
 * Walk through a directory tree and return a JS object that will be used to
 * initialize the treeview sidebar
 */
const walk = (dir) => {
  // eslint-disable-next-line no-console
  console.info('Walking dir: ' + dir);
  const tree = [];

  // Make sure that target directory exists
  try {
    fs.statSync(dir).isDirectory();
  }
  catch (err) {
    overlayText = 'Directory dei dati non trovata';
    return tree;
  }

  // Populate tree nodes from template directories
  for (let i = 0; i < templates.length; ++i) {
    const template = templates[i];
    const templateDirPath = path.join(dir, template.folderName);

    try {
      fs.statSync(templateDirPath).isDirectory();
      tree.push({
        text: path.basename(templateDirPath),
        selectable: false,
        nodes: getTreeNodes(templateDirPath, i),
      });
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Cannot find "' + template.folderName + '" directory');
    }
  }

  return tree;
};


// Create tree nodes for a particular page type (e.g. glossary,...)
const getTreeNodes = (dir, pageType) => {
  const nodes = [];
  const pageDirs = fs.readdirSync(dir);

  // Iterate through subfolders
  pageDirs.forEach((pageDir) => {
    // Skip hidden folders
    if (pageDir[0] === '.')
      return;

    // Assume a page.json file exists inside the folder.
    // This file describes the folder content
    const fullDirPath = path.join(dir, pageDir);
    const jsonObj = require(path.resolve(path.join(fullDirPath, 'page.json')));

    nodes.push({
      text: jsonObj.title,
      orgText: jsonObj.title,
      path: path.join(fullDirPath, 'content.md'),
      pageType: pageType,
      formData: formDataForType(fullDirPath, jsonObj, pageType),
      orgFormData: formDataForType(fullDirPath, jsonObj, pageType),
      icon: 'glyphicon glyphicon-file',
    });
  });

  return nodes;
};


/**
 * Creates form data for a tree node given the page json descriptor and the
 * page type. It returns an object that will be attached to the tree node.
 */
const formDataForType = (dir, jsonObj, pageType) => Object.assign({ pageType },
  templates[pageType].formDataFromJson(jsonObj, dir)
);


/**
 * Obtain jQuery tree node object by node id
 */
const getNode = (nodeId) => $('*[data-nodeid="' + nodeId + '"]');


/**
 * Computes the form data object for the currently selected tree node.
 */
const getFormData = () => {
  const treeNode = tree.treeview('getNode', selNodeId);
  return templates[treeNode.pageType].formDataToJson(treeNode.formData);
};


/**
 * Load markdown file inside the editor
 */
const loadMarkdown = (mdFilePath, currDir) => {
  Promise.resolve()
    .then(() => {
      documentChanged = false;
      ignoreChangedEvent = true;
      currentMdFile = mdFilePath;
      overlayText = 'Attendi..';
      update();

      // htmlDoc is the html representation of the on-disk markdown
      const htmlDoc = document.createElement('div');

      // eslint-disable-next-line no-undef
      htmlDoc.innerHTML = marked(
        fs.readFileSync(mdFilePath, "utf-8"),
        { langPrefix: 'language-' }  // same setting used by ckeditor
      );

      // We get all the img elements in the document
      const imgs = htmlDoc.getElementsByTagName('img');

      // And transform every src attribute from relative to absolute
      const mdImgsDir = path.join(currDir, 'md-imgs');
      [...imgs].map((img) => img.src = relativeToAbsolute(mdImgsDir, img.src));

      // Finally we populate the editor with that data
      editor().setData(htmlDoc.innerHTML);
    })
    .then(wait)
    .then(() => {
      overlayText = '';
      ignoreChangedEvent = false;
      update();
    });
};


// load title, shared text and header image info inside form
const loadFormData = (formData, pageDir, pageType) => {
  templates[pageType].render(formData, pageDir);
};


// save the current editor markdown content to file
const savePage = () => {
  if (currentMdFile !== '') {
    return Promise.resolve()
      .then(() => {
        overlayText = 'Saving..';
        update();

        const currDir = path.dirname(currentMdFile);
        const pageType = currentNodePageType();

        copyFormFiles(currDir, pageType);
        writePageJson(currDir);
        const pageJson = getFormData();
        const finalHTML = syncImages(currDir);
        updateNodeData(pageJson, currDir);

        writeMarkdown(finalHTML);
      })
      .then(wait)
      .then(() => {
        // We do documentChanged = false after wait because otherwise the
        // tree will still think that it changed
        overlayText = '';
        documentChanged = false;

        // loadMarkdown calls update()
        // We call it after wait because a corrupted image is shown otherwise,
        // even if the path is correct
        loadMarkdown(currentMdFile, path.dirname(currentMdFile));
      });
  }
};


const copyFormFiles = (currDir, pageType) => {
  const treeNode = tree.treeview('getNode', selNodeId);
  templates[pageType].collectFormFiles(
    treeNode.formData,
    treeNode.orgFormData,
    currDir,
    copyToDir
    );
};


const writePageJson = (currDir) => {
  fs.writeFileSync(
    path.join(currDir, 'page.json'),
    JSON.stringify(getFormData(), null, '\t')
  );
};


const syncImages = (currDir) => {
  // Obtain all image sources referenced in the markdown editor
  const parser = new DOMParser;
  const dom = parser.parseFromString(editor().getData(), 'text/html');
  const mdImgs = dom.getElementsByTagName('img');
  const mdImgSources = [...mdImgs].map((x) => x.getAttribute('src'));

  // Copy all images in temp dir and then rename it into 'md-imgs'
  const tmpDir = path.join(currDir, 'tmp');
  const mdImgsDir = path.join(currDir, 'md-imgs');
  try {
    fse.emptyDirSync(tmpDir);
    for (let i = 0; i < mdImgSources.length; ++i)
      fse.copySync(mdImgSources[i], path.join(tmpDir, '' + i + '.png'));
    fse.emptyDirSync(mdImgsDir);
    for (let i = 0; i < mdImgSources.length; ++i) {
      const name = '' + i + '.png';
      fse.copySync(path.join(tmpDir, name), path.join(mdImgsDir, name));
    }
    fse.removeSync(tmpDir);
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  for (let i = 0; i < mdImgSources.length; ++i) {
    mdImgs[i].setAttribute('src', 'md-imgs/' + i + '.png');
  }

  // Step 7
  return dom.documentElement.innerHTML;
};


const writeMarkdown = (sourceHTML) => {
  // http://stackoverflow.com/questions/18106164
  const div = document.createElement('div');

  // eslint-disable-next-line no-undef
  div.innerHTML = toMarkdown(sourceHTML);
  const unescapedData = (div.innerText || div.textContent || "");
  fs.writeFileSync(currentMdFile, unescapedData);
};


const copyToDir = (sourceFile, targetDir, options = {mangle: true}) => {
  const sourceName = path.basename(sourceFile);
  const sourceExt = path.extname(sourceName);
  const targetName = (options.mangle) ? uuid.v4() + sourceExt : sourceName;
  const targetFile = path.join(path.resolve(targetDir), targetName);

  copyFile(sourceFile, targetFile);
  loadFormData(getFormData(),
               path.dirname(currentMdFile),
               currentNodePageType());

  return targetName;
};


/* When clicking on a node in the tree, the info to display is fetched from the
 * node itself, not from the disk. Info is fetched from disk only at startup.
 * For this reason, when we modify something in the form, we must also update
 * the selected tree node with the new info, to avoid having to reread the full
 * tree from disk.
 */
const updateNodeData = (obj, dir) => {
  const treeNode = tree.treeview('getNode', selNodeId);
  treeNode.orgText = obj.title;
  treeNode.formData = formDataForType(dir, obj, treeNode.pageType);
  treeNode.orgFormData = Object.assign({}, treeNode.formData);
};


const currentNodePageType = () => {
  return tree.treeview('getNode', selNodeId).pageType;
};


const switchDocument = (nodeData) => {
  const { nodeId, formData } = nodeData;

  if (selNodeId >= 0) {
    const treeNode = tree.treeview('getNode', selNodeId);
    templates[treeNode.pageType].onHide();
  }

  prevNodeId = selNodeId;
  selNodeId = nodeId;

  if (selNodeId >= 0) {
    const treeNode = tree.treeview('getNode', selNodeId);
    templates[treeNode.pageType].onShow();
  }

  loadMarkdown(nodeData.path, path.dirname(nodeData.path)); // calls update()
  loadFormData(formData, path.dirname(nodeData.path), nodeData.pageType);
};


const updateCurrentFormData = (formDataChanges) => {
  if (selNodeId >= 0) {
    const treeNode = tree.treeview('getNode', selNodeId);
    treeNode.formData = Object.assign(treeNode.formData, formDataChanges);
    documentChanged = true;
    update();
  }
};
/* -------------------------------------------------------------------------- */



/* ---------------- events management --------------------------------------- */
const onDocumentChanged = () => {
  if (!ignoreChangedEvent) {
    documentChanged = true;
    update();
  }
};


const onSaveNo = () => {
  const treeNode = tree.treeview('getNode', selNodeId);
  treeNode.formData = Object.assign({}, treeNode.orgFormData);
  switchDocument(selectedNodeData);
};


const onSaveYes = () => {
  savePage().then(() => switchDocument(selectedNodeData));
};


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


const onSelectDirectoryClick = () => {
  shared.selectDirectory((result) => {
    if (result !== undefined) {
      overlayText = 'Scegli un documento oppure';
      storage.set('datadir', result[0]);
      initTree();
    }
  });
};


// This event must be managed here because the title is a shared field between
// contents and glossary templates
const onTitleInput = () => {
  updateCurrentFormData({ title: $('#title').val() });
};


// Called by index.html
// eslint-disable-next-line no-unused-vars
const ckeditorInit = () => ckInit(onDocumentChanged);


const initTree = () => {
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
};


// initialization
$(document).ready(() => {
  // storage.delete('datadir');
  tree = $('#tree');
  initTree();
  for (let i = 0; i < templates.length; ++i) {
    templates[i].init(updateCurrentFormData);
    templates[i].onHide();
  }
});


const connectEvents = () => {
  $('#savebtn').click(savePage);
  $('#save-yes').click(onSaveYes);
  $('#save-no').click(onSaveNo);
  $('#setdir-btn').click(onSelectDirectoryClick);
  $('#title').on('input', onTitleInput);
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
  if (overlayText !== '') {
    $('#overlay-text').html(overlayText);
    const btnVisible = (!overlayText.startsWith('Attendi'));
    $('#setdir-btn').css('visibility', btnVisible ? 'visible' : 'hidden');
    $('#overlay').css('visibility', 'visible');
  }
  else {
    if (selNodeId >= 0) {
      let currPageDir = '';
      if (currentMdFile !== '')
        currPageDir = path.dirname(currentMdFile);
      const treeNode = tree.treeview('getNode', selNodeId);
      templates[treeNode.pageType].render(treeNode.formData, currPageDir);
    }
    $('#overlay').css('visibility', 'hidden');
  }
  updateTree();
}, 0);
/* -------------------------------------------------------------------------- */
