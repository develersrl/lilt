# Lilt

Lilt Breast App Repo.

### Dev Notes

The react-native mobile app is located in the `app` directory.
To setup app dependencies run the following commands inside the `app` directory (assuming that `node` and `npm` commands are available):

```
$ npm install
...
$ rnpm link
```

If you do not have the `rnpm` package, you should install it globally:

```
$ npm install -g rnpm
```

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

Now open the Xcode app project and launch the app.
