# Lilt

Lilt Breast App Repo.

## [Index](#index)

* [Mac Dev Environment Setup](#mac-dev-environment-setup)
  * [Cocoa Dependencies Setup](#cocoa-dependencies-setup)
  * [React-Native Dependencies Setup](#react-native-dependencies-setup)
  * [Generating and Launch the App](#generating-and-launch-the-app)

* [App Code Generation](#app-code-generation)
  * [Page Generation Overview](#page-generation-overview)
  * [Button](#button)
  * [Markdown](#markdown)
  * [Navigation](#navigation)

* [Markdown Supported Syntax](#markdown-supported-syntax)

* [Users Spreadsheet](#users-spreadsheet)

* [App Content Editor](#app-content-editor)

## [Mac Dev Environment Setup](#index)

The following guide assumes that `node` and `npm` commands are available in the system, and Xcode is installed.

### [Cocoa Dependencies Setup](#index)

The Lilt Xcode project has some Cocoa dependencies.
If you do not have [cocoapods](https://cocoapods.org/) installed in your system, you have to install it with the following command:

```
$ brew install cocoapods
```

Or, if you prefer `gem`:

```
$ gem install cocoapods
```

If this is your first time using CocoaPods, run `pod setup` to create a local CocoaPods spec mirror.

Now go into `app/ios` folder and run `pod setup` to install the dependencies (the [Mixpanel](https://mixpanel.com/report/1015849/explore/) dependency for now).

### [React-Native Dependencies Setup](#index)

The react-native mobile app is located in the `app` directory.
To setup react-native dependencies run the following commands inside the `app` directory (assuming that `node` and `npm` commands are available):

```
$ npm install
...
$ rnpm link
```

If you do not have the `rnpm` package, you should install it globally:

```
$ npm install -g rnpm
```

and re-run `rnpm link` inside the `app` directory.

### [Generating and Launch the App](#index)

Application code is partially generated from a Python script which requires a virtualenv.
Just `cd` to the `app` dir and load the Python (2.7) virtualenv from requirements file.

Example using `virtualenvwrapper`:

```bash
$ mkvirtualenv lilt
...
$ (lilt) pip install -r requirements.txt
```

Now you can launch the code generation and packager:

```
$ npm run gen
...
$ npm start
```

Now you can open the Xcode app project and launch the app.


## [App Code Generation](#index)

Application content is partially generated by a Python script from the content of a json file.

To generate the application react-native code, cd to the `app` directory, setup the Python virtualenv (see [this section](#mac-dev-environment-setup) for details) and run:

```
(lilt-venv)$ npm run gen
```

### [Page Generation Overview](#index)

The input json file is `pages.json`, located under the `app/content` directory.
In general, all the stuff used as input for the generation process is located under the `app/content` directory.

The `pages.json` file contains an array of application pages descriptors, where each page is described as a json object:

```
[
    { ... }, // page 1 descriptor
    { ... }, // page 2 descriptor
    ...,
    { ... }  // page n descriptor
]
```

To better explain the process, suppose that we want to generate a page that contains only one button; when the user press the button we want to switch to an hardcoded page.
We can define our page in this way:

```
{
    "id": "1",  // unique page identifier
    "title": "My Title",  // page title
    "style": "my_page",  // page style (see later)
    "content": {  // page content
        "myButton": {
            "type": "button",
            "text": "Press Me!",
            "link": "hardcoded_page"
        }
    }
}
```

Each page has a unique id and a title.

The `style` property identifies the page template. In the example we use the template `my_page`.
Page templates are located inside the `templates` directory.
The template filename is computed from the `style` property in the json by adding the `.tmpl.js` suffix.
So in the example the targeted template would be `my_page.tmpl.js`.

Let's pretend that our page template is the following:

```
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import * as style from '../../style';
import * as blocks from '../../blocks';


export default class MyPage extends Component {
  render() {
    const { flexible, stretch } = style.common;
    const { Button } = blocks;

    return (
      <View style={[flexible, stretch]}>
        {{myButton}}
      </View>
      );
  }
}
```

The `content` object describes the page content to be generated.

Each content item is identified by a name: the key of the item (`myButton` in the example).
The "myButton" string must refer to a placeholder in the corresponding page template, so that the generation script knows where to put the generated code.

Each item has at least the `type` property that identifies the kind of item (`button` in the example).
For now, the supported types are `button` and `markdown`.

Each item can then have other properties, that are specific to the particular item type.
The generation script iterates through the page content and generates the react-native code relative to the content items.

After the code generation step, the script places the generated react-native components inside the `js/pages/generated` directory. This is an important detail, because every relative path you use in page templates (e.g. import paths, require paths) must be relative to the generated page directory (not the page template directory).

### [Button](#index)

An example of button item is:

```
{
    "type": "button",
    "text": "Press Me!",
    "link": "#1"
}
```

All properties are required.

* `type`: identifies the item type and must be the "button" string;
* `text`: this is the button text;
* `link`: identifies the page this button leads to.
  As of now, two type of links are supported:
  * links to a generated page: in this case the link must be in the form "#[target_page_id]", where _target_page_id_ is a valid page identifier in `pages.json` file;
  * links to custom (i.e. not-generated) pages: in this case the link string must be the navigator route key explicitly defined in `navigator_data.tmpl.js` file.

### [Markdown](#index)

A markdown item example is:

```
{
    "type": "markdown",
    "source": "my_markdown.md"
}
```

All properties are required.

* `type`: identifies the item type and must be the "markdown" string;
* `source`: the name of source markdown file.
  In the above example, the generation script searches for a file named `my_markdown.md` inside the `app/content/markdown` directory.

A `ScrollView` react-native component is generated for each markdown item.
The scroll view shows the rendered markdown inside it.

### [Navigation](#index)

Navigation between app pages is partially generated, too.
The reference template file is `navigator_data.tmpl.js` inside the `templates` directory.

Navigator routes are aggregated into the `routes` object.
Each route is identified by its key in the `routes` object, and it has a `title` and `component` property.

The final `routes` object is the aggregation of two sub-objects:

* the `customRoutes` object, which hold "hardcoded" routes;
* the `generatedRoutes` object, generated by the script from the informations in `pages.json` file.

Another important variable here is the `initialRouteId` string, which must be set to the id of app start route (either a generated route or an "hardcoded" route).


## [Markdown Supported Syntax](#index)

The markdown syntax that is currently supported is a subset of gfm (Github Flavoured Markdown):

* headers (e.g. `## <header-string>`);

* paragraphs (blocks of text separated by a blank line);

* bold style (e.g. `** bold text **`);

* images (e.g. `![alt-text](img)`)
  An image can be either "local" or identified by an url:
  * "local" image example: `![local-image](my_local_image.png)`
  In case of local images the markdown renderer "requires" (in react-native sense) that image from the `app/content/images/static` folder;
  * "remote" image example: `![remote-image](http://www.mysite.com/img.png)`
  In case of "remote" image, the markdown renderer downloads the image and put it into the `app/content/images/downloaded` directory. Once the download is finished, the renderer "requires" the downloaded image from the `downloaded` folder.


## [Users Spreadsheet](#index)

The mobile app sends registered users data to a Google Spreadsheet, available at this link (only to collaborators):

https://docs.google.com/a/develer.com/spreadsheets/d/1nAjN9vGYAPilzWVlCfcxcUG_ux_bbJgHeSdrbATWQ4M/edit?usp=sharing

The spreadsheet is accessed through a Google Apps Script, that exposes a POST endpoint to the mobile app.
The Google Apps Script can be found in `users-backend` directory.

A development version of the webapp exposed by the script is available at this address:

https://script.google.com/macros/s/AKfycbx6BxoBZuWC9CkQvkfnythFSp2nIIi3TGezCLM0K058l_h_BQQ/exec

If you want to deploy the webapp elsewhere in order to use another spreadsheet, follow these steps:

* create the Google Spreadsheet and identify its "spreadsheet id".
  The spreadsheet id is part of the spreadsheet url:
  `https://docs.google.com/spreadsheets/d/<spreadsheet-id>/edit#gid=0`
* annotate the name of the sheet where you want to store users data (this will be referred as `sheet-id`);
* create a new Google Apps Script project, then copy and paste the code from `users_manager.gs` into an empty `gs` file;
* In the "Main Variables" section fill the `spreadsheetId` variable with the spreadsheet id and the `usersSheetName` variable with `sheet-id`;
* deploy the script as a webapp:
  * Menu "Pubblica -> Distribuisci come applicazione web.."
  * in "Versione del progetto" selezionare "Nuovo"
  * "Esegui l'applicazione come": selezionare "Io" o comunque un account che ha i diritti necessari in lettura/scrittura sullo spreadsheet;
  * In "Chi accede all'applicazione" selezionare "Chiunque, inclusi utenti anonimi";
  * premere "Implementa" ed accettare eventuali richieste di autorizzazioni.


## [App Content Editor](#index)

The repository contains a simple markdown editor based on [electron](http://electron.atom.io/) inside the `markdown-editor` folder.

To launch the editor from scratch:

```bash
cd markdown-editor
npm install
npm start
```

Next time you will use the `npm start` command only.

The markdown editor allows you to edit `md` documents inside a folder.
By default, the `./markdown` folder is used (relative to the app directory), but you can pass another folder via command-line (if you take a look at the `package.json` file you will see that `npm start` executes the editor passing the `./testdir` directory).

Optionally you can show the developer tools specifying the `LILT_EDITOR_SHOW_DEVTOOLS` environment variable, and setting its value to 1.

To deploy a new editor version from a Mac, make sure you have `electron-packager` installed globally:

```bash
npm install -g electron-packager
```

The `wine` command must be available too, because we are going to generate a Windows executable.

At this point:

* adjust the editor version in `package.json` file
* run the `deploy.sh` script

The `deploy.sh` script packages the app for mac (x64) and Windows platform.
If everything goes well an `out` folder containing two zip files (one per platform) will be created.
You can now git-tag the new version and upload the new release on github.
