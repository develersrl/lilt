'use strict';

import { StyleSheet } from 'react-native';


const common = StyleSheet.create({
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
    fontSize: 14,
  },
});


const block = {
  expandable: StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: '#EB9A5B',
    },
    titleView: {
      height: 40,
      flexDirection: 'row',
    },
    signImg: {
      margin: 3,
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    titleTextView: {
      flex: 1,
      justifyContent: 'center',
    },
  }),
};


module.exports = { common, block };
