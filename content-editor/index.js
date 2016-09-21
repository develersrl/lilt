const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const uuid = require('node-uuid');

// Load marked.js inside ckeditor plugin 'markdown'
CKEDITOR.scriptLoader.load(
  path.join('ckeditor', 'plugins', 'markdown', 'js', 'marked.js')
);

// Load to-markdown.js inside ckeditor plugin 'markdown'
CKEDITOR.scriptLoader.load(
  path.join('ckeditor', 'plugins', 'markdown', 'js', 'to-markdown.js')
);

/* ---------------- state --------------------------------------------------- */
// default markdown directory
const defaultMarkdownDir = 'appdata';

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

// Used to append info to window title
const baseWindowTitle = remote.getCurrentWindow().getTitle();

// constants
const PAGE_TYPES = {
    CONTENTS: 0,
    GLOSSARY: 1
};
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

const isMac = () => (remoteProcess.platform.startsWith('darwin'));

// return the markdown directory
const getMarkdownDir = () => {
  // obtain command line arguments
  const args = remoteProcess.argv.slice(isProdEnvironment() ? 1 : 2);

  if (args.length === 0) {
    // Try to read the input directory from environment
    const envdir = remoteProcess.env.LILT_EDITOR_DATA_DIR;
    if (envdir !== undefined) {
      console.info('Reading markdown directory from environment variable');
      return envdir;
    }

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
  }

  if (args.length > 1)
    console.error('wrong arguments');  // eslint-disable-line no-console

  // we expect the markdown dir as the only parameter
  return args[0];
};


// walk through a directory tree and return a JS object that will be used to
// initialize the treeview sidebar
const walk = (dir) => {
  console.info('Walking dir: ' + dir);
  const tree = [];

  try {
    fs.statSync(dir).isDirectory();
  }
  catch (err) {
    overlayText = 'Cannot find data directory';
    return tree;
  }

  const contentDirPath = path.join(dir, 'Contenuti');
  const glossaryDirPath = path.join(dir, 'Glossario');
  // We know we have 2 top level nodes: Contents and Glossary
  tree.push({
    text: path.basename(contentDirPath),
    selectable: false,
    nodes: getTreeNodes(contentDirPath, PAGE_TYPES.CONTENTS)
  })

  tree.push({
    text: path.basename(glossaryDirPath),
    selectable: false,
    nodes: getTreeNodes(glossaryDirPath, PAGE_TYPES.GLOSSARY)
  })

  return tree;
};

const getTreeNodes = (dir, pageType) => {
  const nodes = [];
  const pageDirs = fs.readdirSync(dir);

  pageDirs.forEach((pageDir) => {
    if (pageDir[0] == '.')
      return;

    const fullDirPath = path.join(dir, pageDir);
    const jsonObj = require(path.resolve(path.join(fullDirPath, 'page.json')));
    nodes.push({
      text: jsonObj.title,
      orgText: jsonObj.title,
      path: path.join(fullDirPath, 'content.md'),
      pageType: pageType,
      formData: formDataForType(jsonObj, pageType),
      icon: 'glyphicon glyphicon-file'
    });
  });

  return nodes;
};

const formDataForType = (jsonObj, pageType) => {
    const formData = {
        title: jsonObj.title,
        pageType: pageType
    };

    if (pageType === PAGE_TYPES.CONTENTS) {
        formData.headerImage = jsonObj.headerImage;
        formData.pdfFile = jsonObj.pdfFile;
        formData.sharedText = jsonObj.sharedText;
    } else if (pageType === PAGE_TYPES.GLOSSARY) {
        /* Your honor, I have nothing to add */
    }

    return formData;
};

// obtain jQuery tree node object by node id
const getNode = (nodeId) => $('*[data-nodeid="' + nodeId + '"]');

// get current formData
const getFormData = () => {
  const pageType = currentNodePageType();
  const formData = {
    title: $('#title').val()
  };

  if (pageType === PAGE_TYPES.CONTENTS) {
    formData.sharedText = $('#shared-text').val();
    formData.pdfFile = $('#pdf-name').text();
    formData.headerImage = path.basename($('#header-pic').attr('src'));
  };

  return formData;
};

// load markdown file inside the editor
const loadMarkdown = (mdFilePath, currDir) => {
  Promise.resolve()
    .then(() => {
      documentChanged = false;
      ignoreChangedEvent = true;
      currentMdFile = mdFilePath;
      overlayText = 'Loading..';
      update();

      // Function to transform a relative src path to an absolute one
      const relativeToAbsolute = (rel) => {
        // Since we first load the raw html to a div to parse it, the browser
        // will automatically transform any relative paths to absolute, but it
        // will do it from the point of view of the binary executable, so the
        // relative paths we get here are actually wrong absolute paths. Since
        // we are really only interested in the name of the image file, we use
        // path.basename to remove the wrong absolute portion of the path
        return path.resolve(path.join(currDir, path.basename(rel)));
      };

      // htmlDoc is the html representation of the on-disk markdown
      const htmlDoc = document.createElement('div');
      htmlDoc.innerHTML = marked(
        fs.readFileSync(mdFilePath, "utf-8"),
        { langPrefix: 'language-' }  // same setting used by ckeditor
      );

      // We get all the img elements in the document
      const imgs = htmlDoc.getElementsByTagName('img');
      // And transform every src attribute from relative to absolute
      [...imgs].map((img) => img.src = relativeToAbsolute(img.src));

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
  document.title = baseWindowTitle + ' — ' + formData.title;
  $('#title').val(formData.title);
  $('#shared-text').val(formData.sharedText);

  if (pageType === PAGE_TYPES.CONTENTS) {
    $('#shared-text-div').show();
    $('#header-image-div').show();
    $('#pdf-file-div').show();
  } else if (pageType === PAGE_TYPES.GLOSSARY) {
    $('#shared-text-div').hide();
    $('#header-image-div').hide();
    $('#pdf-file-div').hide();
  }

  if (formData.pdfFile) {
    $('#pdf-name').text(path.basename(formData.pdfFile));
    $('#pdf-name').removeClass('hidden');
  } else {
    $('#pdf-name').addClass('hidden');
  }

  if (formData.headerImage) {
    $('#header-pic').attr('src', path.resolve(path.join(pageDir, formData.headerImage)));
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
        update();

        const currDir = path.dirname(currentMdFile);
        const pageType = currentNodePageType();

        copyFormFiles(currDir, pageType);
        writePageJson(currDir);
        const pageJson = getFormData();
        // pageJson.headerImage is allowed to be undefined, syncImages knows
        // about it
        const finalHTML = syncImages(currDir, pageJson.headerImage);
        updateNodeData(pageJson);

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
  if (pageType === PAGE_TYPES.CONTENTS) {
    const headerFile = $('#header-image')[0].files[0];
    const pdfFile = $('#pdf-input')[0].files[0];

    if (headerFile) {
      const newName = copyToDir(headerFile.path, currDir);
      $('#header-pic').attr('src', path.join(currDir, newName));
    }

    if (pdfFile)
      copyToDir(pdfFile.path, currDir, {mangle: false});
  }

  // Reset input fields to avoid copying the files at every save
  $('#header-image').val('');
  $('#pdf-input').val('');
};

const writePageJson = (currDir) => {
  fs.writeFileSync(
    path.join(currDir, 'page.json'),
    JSON.stringify(getFormData(), null, '\t')
  );
};

const syncImages = (currDir, headerImage) => {
/* High-level overview of the process:
 * 1: We list every image referenced in the markdown (mdImgs)
 * 2: We separate those that are outside our dir in a list (external) as
 *    tuples (path, index).
 *    The index is the one from the original list (mdImgs). This will be needed
 *    when we'll modify the ckeditor's html before saving it as markdown.
 * 3: We list all the images inside our dir (currImgs)
 * 4: Delete all the images that appear in currImgs but not in mdImgs, because
 *    that means that they have been removed from the markdown. The header
 *    image (fetched from page.json) is excluded, meaning we consider it as if
 *    it were in the markdown.
 * 5: We copy all the images in the external list in our dir, changing their
 *    name to an uuid and at the same time replacing the src attributes of the
 *    elements inside mdImgs to the new name.
 * 6: We iterate over every internal image and replace the corresponding src
 *    attribute inside mdImgs to the base name, since at this point every src
 *    is absolute, even those that point inside our directory.
 * 7: We return the processed resulting html so that it can then be written to
 *    disk.
 */

  // Step 1
  const parser = new DOMParser;
  const dom = parser.parseFromString(editor().getData(), 'text/html');
  const mdImgs = dom.getElementsByTagName('img');

  // Step 2
  // Helper function to determine if a src path is internal to the current dir
  const isExternal = (src) => {
    // path.relative(dir, file) outputs the relative path of file from dir
    // Example: if dir is "/home/foo" and file is "/home/foo/bar.png" then
    // path.relative(dir, file) outputs "bar.png". If file were "/home/bar.png"
    // path.relative(dir, file) would output "../bar.png".
    // So anything that is "up" in the directory tree, and thus external to our
    // currDir, inevitably starts with ".."
    // On windows the path will be something like "..\\bar.png"
    const relPath = path.relative(currDir, src);
    // But there is another case: different roots. *nix systems have a common
    // root: /. Windows, on the other hand, can have different roots: C:, D:
    // and so on. If src is on a different root than currDir than path.relative
    // will output src, which will be an absolute path with a different root.
    // For example, if currDir is somewhere on C: and is
    // 'markdown/Contenuti/foo', and src is 'D:/images/bar.png' then
    // path.relative(currDir, src) will output 'D:/images/bar.png', which is
    // pretty clearly *not* a relative path, but it still means the src is
    // external to our currDir.
    return relPath.startsWith("..") || path.isAbsolute(relPath);
  };
  const external = [];
  const internal = [];
  for (let index = 0; index < mdImgs.length; index++) {
    const imgVal = mdImgs[index].getAttribute('src');
    if (isExternal(imgVal))
      external.push({ path: imgVal, originalIndex: index });
    else
      internal.push({ name: path.basename(imgVal), originalIndex: index });
  }

  // Step 3
  const dirFiles = fs.readdirSync(currDir);
  const isImage = (x) => ['.png', '.jpg'].includes(path.extname(x));
  const currImgs = dirFiles.filter(isImage);

  // Step 4
  // We use [...] because mdImgs is not an array, but an HTMLCollection
  // We use path.basename because each src attribute is an absolute path, but
  // we are only interested in the image name
  const mdImgsSrcs = [...mdImgs].map((x) => path.basename(x.getAttribute('src')));
  if (headerImage) mdImgsSrcs.push(headerImage);
  const toDelete = currImgs.filter((x) => !mdImgsSrcs.includes(x));
  // We map fs.unlink on every element of toDelete. Since toDelete contains
  // image names rather than paths, we need to resolve those and unlink them.
  // fs.unlink also takes a completion callback, which we provide.
  toDelete.map((imgName) => {
    const imgPath = path.resolve(path.join(currDir, imgName));
    fs.unlink(imgPath, (err) => {
      if (err) {
        console.error("error deleting", imgPath + ":");
        console.error(err);
      }
    });
  });

  // Step 5
  for (let img = 0; img < external.length; img++) {
    const origIdx = external[img].originalIndex;
    const newImageName = copyToDir(external[img].path, currDir);
    mdImgs[origIdx].setAttribute('src', newImageName);
  }

  // Step 6
  for (let img = 0; img < internal.length; img++) {
    const origIdx = internal[img].originalIndex;
    mdImgs[origIdx].setAttribute('src', internal[img].name);
  }

  // Step 7
  return dom.documentElement.innerHTML;
};

const writeMarkdown = (sourceHTML) => {
  // http://stackoverflow.com/questions/18106164
  const div = document.createElement('div');
  div.innerHTML = toMarkdown(sourceHTML);
  const unescapedData = (div.innerText || div.textContent || "");
  fs.writeFileSync(currentMdFile, unescapedData);
};

const copyToDir = (sourceFile, targetDir, options = {mangle: true}) => {
  const sourceName = path.basename(sourceFile);
  const sourceExt = path.extname(sourceName);
  const targetName = (options.mangle) ? uuid.v4() + sourceExt : sourceName;
  const targetFile = path.join(path.resolve(targetDir), targetName);

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

  outStream.on('finish', () => {
    loadFormData(getFormData(), path.dirname(currentMdFile))
  });

  inStream.pipe(outStream);
  return targetName;
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

  if (treeNode.pageType === PAGE_TYPES.CONTENTS) {
    treeNode.formData.sharedText = obj.sharedText;
    treeNode.formData.pdfFile = obj.pdfFile;
    treeNode.formData.headerImage = obj.headerImage;
  }
};

const currentNodePageType = () => {
  return tree.treeview('getNode', selNodeId).pageType;
};

const switchDocument = (nodeData) => {
  prevNodeId = selNodeId;
  selNodeId = nodeData.nodeId;
  loadMarkdown(nodeData.path, path.dirname(nodeData.path)); // calls update()
  loadFormData(nodeData.formData, path.dirname(nodeData.path), nodeData.pageType);
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
      { name: 'insert', groups: ['insert'] },
      // { name: 'others' },  // uncomment to show "Markdown" btn
    ],
    removeButtons: 'Underline,Subscript,Superscript,Strike,' +
        'Styles,Cut,Copy,Paste,PasteText,PasteFromWord,Table,' +
        'HorizontalRule,SpecialChar,Image',
    extraPlugins: 'markdown,fs-image',
    format_tags: 'p;h1;h2;h3;pre',  // eslint-disable-line camelcase
    removeDialogTabs: 'image:advanced;link:advanced',
    width: '100%',
    removePlugins: 'elementspath',
    allowedContent: 'h1 h2 h3 p strong em pre; img[!src]',
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
  $('#header-image').on('change', onHeaderImageChanged);
  $('#pdf-input').on('change', onDocumentChanged);
  $('#pdf-input').on('change', onPdfChanged);
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
