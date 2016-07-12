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
  mediumText: {
    fontSize: 12,
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
};


const pages = {
  glossary: StyleSheet.create({
    container: {
      flex: 1,
    },
  }),
};


module.exports = { common, blocks, pages };
