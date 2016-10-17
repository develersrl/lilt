'use strict';

import { StyleSheet, Dimensions, PixelRatio } from 'react-native';


const pr = (sz) => sz * PixelRatio.get();


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
  tabBarHeight: 49,
  statusBarHeight: 22,
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
    paragraphText: {
      fontFamily: 'GillSans',
      fontSize: 16,
      color: '#8E8E8E',
      lineHeight: 20,
    },
    image: {
      borderWidth: 1,
      borderColor: '#0000FF',
      resizeMode: 'contain',
      height: 100,
      width: 150,
    },
    text: {},
    link: {
      color: '#74B3FA',
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
      color: '#FF9C8D',
      fontFamily: 'GillSans-Bold',
      fontSize: 13,
      marginTop: 10,
    },
    caption: {
      flex: 1,
      color: '#7B7A7A',
      fontFamily: 'GillSans',
      fontSize: 13,
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
    textGap: 7,
    side: 60,
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
    textGap: 10,
    textColor: '#D93D56',
    fontSize: 14,
    activeOpacity: 0.6,
    textDisabledColor: '#666666',
  },
  tabbar: {
    barColor: '#CC0000',
    textUnselectedColor: 'white',
    textSelectedColor: '#FF9C8D',
    profileUnselectedIcon: require('../images/bar-profile-1.png'),
    profileSelectedIcon: require('../images/bar-profile-2.png'),
    structuresUnselectedIcon: require('../images/bar-structures-1.png'),
    structuresSelectedIcon: require('../images/bar-structures-2.png'),
    homeUnselectedIcon: require('../images/bar-home-1.png'),
    homeSelectedIcon: require('../images/bar-home-2.png'),
    aboutUnselectedIcon: require('../images/bar-about-1.png'),
    aboutSelectedIcon: require('../images/bar-about-2.png'),
    sponsorUnselectedIcon: require('../images/bar-sponsor-1.png'),
    sponsorSelectedIcon: require('../images/bar-sponsor-2.png'),
  },
  structureitem: {
    titleRowHeight: 50,
    markerWidth: 15,
    markerTitleGap: 10,
    titleFontSize: 12,
    subtitleFontSize: 12,
    titleInfoGap: 5,
    iconSide: 15,
    iconValuesGap: 15,
    infoSpacing: 5,
    infoFontSize: 13,
    fontColor: '#444444',
  },
  segmentcontrolios: {
    valuesRowHeight: 40,
    footerHeight: 20,
    backgroundColor: '#C9D5F1',
    selectedBackgroundColor: '#93B8D8',
    separatorColor: '#E5E9F1',
    normalFontSize: 14,
    selectedFontSize: 12,
    fontColor: '#444444',
    activeOpacity: 0.8,
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
    menuHeight: 200,
    belowMenuHeight: 100,
    logoImageHeight: 45,
    logoImage: require('../images/logo_home.png'),
    logoParagraphFontSize: 15,
    logoParagraphLineHeight: 20,
    logoParagraphMargins: 30,
    menuTopLeftBackground: '#FFE0D0',
    menuTopLeftIcon: require('../images/know-more.png'),
    menuTopRightBackground: '#C1DBF8',
    menuTopRightIcon: require('../images/prevention.png'),
    menuBottomLeftBackground: '#74B3FA',
    menuBottomLeftIcon: require('../images/early-diagnosis.png'),
    menuBottomRightBackground: '#FF9C8D',
    menuBottomRightIcon: require('../images/wiki.png'),
    customMenuCircleWidth: 50,
    customMenu1Icon: require('../images/prevention-path.png'),
    customMenu2Icon: require('../images/positive-diagnosis.png'),
    customMenu3Icon: require('../images/something-bad.png'),
    customMenu4Icon: require('../images/post-therapy.png'),
    customMenuIconTextGap: 10,
    customMenuTextMargins: 5,
    customMenuTextFontSize: 11,
    customMenuLeftRightMargins: 10,
  },
  question: {
    backgroundColor: '#C1DBF8',
    bodyPadding: 20,
    questionTitleFontSize: 14,
    questionFontSize: 16,
    answersSpacing: 20,
    circlesWidth: 8,
    circlesSpacing: 8,
    circlesPadding: 30,
    circleSelectedColor: '#FF9C8D',
    circleUnselectedColor: '#A8A8A8',
  },
  profile: {
    bodyPadding: 20,
    iconWidth: 100,
    iconHeight: 100,
    infoPaddingTopBottom: 16,
    infoPaddingLeftRight: 10,
    infoBackground: '#C1DBF8',
    infoSpacing: 10,
    textColor: 'white',
    labelsFontSize: 16,
    valuesFontSize: 16,
    explanationFontSize: 14,
    explanationColor: '#8E8E8E',
    editBtnBackground: '#FF9C8D',
    editBtnFontSize: 14,
    editBtnActiveOpacity: 0.8,
  },
  registerModify: {
    paddingLeftRight: 20,
    textPaddingLeftRight: 10,
  },
  structures: {
    titleFontSize: 13,
    subtitleFontSize: 13,
    titleSubtitleGap: 10,
    segmentsColor: '#93B8D8',
    listLeftRightPadding: 20,
    listTopBottomPadding: 10,
    listItemsSpacing: 15,
  },
};


module.exports = { common, blocks, pages };
