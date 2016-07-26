'use strict';

import { StyleSheet } from 'react-native';


const common = StyleSheet.create({
  debug: {
    borderWidth: 1,
    borderColor: '#FFFF00',
  },
  debug1: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  debug2: {
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  debug3: {
    borderWidth: 1,
    borderColor: '#0000FF',
  },
  centeredChildren: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  mediumText: {
    fontSize: 12,
  },
  flexible: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});


const blocks = {
  expandable: StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: '#EB9A5B',
    },
    titleView: {
      flexDirection: 'row',
    },
    imgView: {
      padding: 2,
    },
    signImg: {
      width: 15,
      height: 15,
      resizeMode: 'contain',
    },
    titleTextView: {
      flex: 1,
      justifyContent: 'center',
    },
    contentView: {
      marginLeft: 15,  // signImg
      height: 300,
      marginTop: 10,
    },
  }),
  button: {
    underlayColor: '#999999',
    css: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#CCCCCC',
      borderWidth: 1,
      borderColor: '#DDDDDD',
    },
  },
  markdown: StyleSheet.create({
    container: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'red',
    },
    header: {
      fontWeight: 'bold',
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
    },
  }),
};


const pages = {
  navigator: {
    nav: {
      paddingTop: 20,  // status bar height
    },
    wrapped: {
      marginTop: 44,  // navigation bar height
    },
  },
};


module.exports = { common, blocks, pages };
