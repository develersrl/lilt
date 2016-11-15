'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

import { Stripe } from '../../blocks';
import { pages, blocks } from '../../style';


export default class GlossaryWord extends Component {
  render() {
    const { markdown } = blocks;
    return (
      <ScrollView style={myStyle.container}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  >
        <View style={myStyle.titleView}>
          <Text style={myStyle.titleText}>{{title}}</Text>
        </View>
        <View style={myStyle.bodyView}>
          {{body}}
        </View>
      </ScrollView>
      );
  }
}


const { glossaryWord } = pages;
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: glossaryWord.backgroundColor,
    marginTop: (Platform.OS === 'ios' ? 44 : 0),
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
