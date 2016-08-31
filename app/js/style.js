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
    },
    header: {
      fontWeight: 'bold',
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
    },
  }),
  image: {
    borderWidth: 1,
    borderColor: '#0000FF',
    resizeMode: 'contain',
    height: 100,
    width: 150,
  },
  linkListItem: {
    container: {
      height: 150,
    },
    body: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 20,
    },
    separator: {
      borderTopWidth: 1,
      borderTopColor: '#D0D0D0',
      backgroundColor: '#A0A0A0',
      borderBottomWidth: 1,
      borderBottomColor: '#D0D0D0',
      height: 3,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 50,
    },
    captionRow: {
      paddingLeft: 55,
    },
    title: {
      color: '#EB8478',
      fontWeight: 'bold',
      fontSize: 20,
    },
    caption: {
      color: '#7B7A7A',
      fontWeight: '600',
      fontSize: 18,
    },
    linkView: {
      alignSelf: 'stretch',
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  stripe: {
    height: 150,
    spacing: 10,
    footerHeight: 24,
    circleSpacing: 5,
    circleSelected: '#EB8478',
    circleUnselected: '#B6CFE9',
  },
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
  content: {
    header: {
      container: {
        height: 200,
      },
      footer: {
        height: 50,
        flexDirection: 'row',
      },
      separator: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
      },
      actionView: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
      },
      titleText: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    },
    body: {
      flex: 1,
    },
  },
};


module.exports = { common, blocks, pages };
