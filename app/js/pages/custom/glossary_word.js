'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { pages } from '../../style';


export default class GlossaryWord extends Component {
  render() {
    return (
      <View style={myStyle.container}>
        <View style={myStyle.titleView}>
          <Text style={myStyle.titleText}>TEST VOCABOLO</Text>
        </View>
        <View style={myStyle.bodyView}>
          <Text>Hello body</Text>
        </View>
      </View>
      );
  }
}


const { glossaryWord } = pages;
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: glossaryWord.backgroundColor,
  },
  titleView: {
    height: glossaryWord.titleHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: glossaryWord.titleColor,
    fontFamily: glossaryWord.titleFont,
    fontSize: glossaryWord.titleFontSize,
  },
  bodyView: {
    padding: glossaryWord.bodyPadding,
  },
});
