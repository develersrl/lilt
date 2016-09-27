'use strict';

import { StyleSheet, Dimensions } from 'react-native';


const common = {
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
  form: {
    fieldHeight: 50,
  },
};


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
      fontFamily: 'GillSans-Bold',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 10,
      color: '#494949',
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
    },
    image: {
      borderWidth: 1,
      borderColor: '#0000FF',
      resizeMode: 'contain',
      height: 100,
      width: 150,
    },
    text: {
      fontFamily: 'GillSans',
      fontSize: 16,
      color: '#8E8E8E',
      lineHeight: 20,
    },
    emphasis: {
      fontStyle: 'italic',
    },
    doubleEmphasis: {
      fontFamily: 'GillSans-Bold',
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
    body: {
      flex: 1,
      paddingTop: 15,
      paddingBottom: 15,
    },
    separator: {
      backgroundColor: '#A7A7A7',
      height: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 50,
    },
    captionRow: {
      paddingLeft: 55,
    },
    title: {
      color: '#EB8478',
      fontFamily: 'GillSans-Bold',
      fontSize: 16,
      marginTop: 10,
    },
    caption: {
      flex: 1,
      color: '#7B7A7A',
      fontFamily: 'GillSans',
      fontSize: 14,
      marginRight: 5,
    },
    linkView: {
      alignSelf: 'stretch',
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrow: {
      width: 45,
      resizeMode: 'contain',
    },
  },
  stripe: {
    spacing: 10,
    marginTopBottom: 10,
    footerHeight: 24,
    circleSpacing: 5,
    circleSelected: '#EB8478',
    circleUnselected: '#B6CFE9',
  },
  squareMenu: {
    pressedOpacity: 0.8,
    circleTextGap: 7,
    circleBorderWidth: 1.5,
    circleSide: 50,
  },
  answer: {
    circleViewWidth: 50,
    circleWidth: 16,
    backgroundColor: '#FF9C8D',
    answerPadding: 10,
    color: 'white',
    fontSize: 14,
    selectionUnderlay: '#FFFFFF11',
  },
  arrowMenu: {
    imageWidth: 34,
    textGap: 15,
    textColor: '#D93D56',
    fontSize: 14,
    activeOpacity: 0.6,
    textDisabledColor: '#666666',
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
        height: 280,
        width: Dimensions.get('window').width,
        resizeMode: 'stretch',
      },
      footer: {
        height: 40,
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
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
      },
      actionImg: {
        width: 25,
        resizeMode: 'contain',
      },
      text: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
      },
      titleText: {
        fontFamily: 'GillSans',
        fontSize: 24,
      },
    },
    body: {
      container: {
        padding: 10,
      },
      text: {
        fontFamily: 'GillSans',
        fontSize: 16,
        color: '#8E8E8E',
        lineHeight: 20,
      },
    },
  },
  glossaryWord: {
    backgroundColor: '#C1DBF8',
    titleHeight: 100,
    titleColor: '#FFFFFF',
    titleFont: 'GillSans-Bold',
    titleFontSize: 16,
    bodyPadding: 10,
  },
  home: {
    aboveMenuHeight: 100,
    menuHeight: 250,
    belowMenuHeight: 100,
    menuTopLeft: {
      background: '#FFE0D0',
    },
    menuTopRight: {
      background: '#C1DBF8',
    },
    menuBottomLeft: {
      background: '#74B3FA',
    },
    menuBottomRight: {
      background: '#FF9C8D',
    },
  },
  question: {
    backgroundColor: '#C1DBF8',
    bodyPadding: 30,
    questionPadding: 20,
    questionFontSize: 16,
    answersSpacing: 20,
    circlesWidth: 8,
    circlesSpacing: 8,
    circlesPadding: 30,
    circleSelectedColor: '#FF9C8D',
    circleUnselectedColor: '#A8A8A8',
  },
};


module.exports = { common, blocks, pages };
