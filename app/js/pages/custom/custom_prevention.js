'use strict';

import React, { Component } from 'react';

import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { getQuestionsCount, getQuestionData } from '../../state';

import { common, blocks, pages } from '../../style';
const { customPrevention: globSt } = pages;
const { markdown } = blocks;


export default class Content extends Component {
  renderParagraph(questionIndex) {
    const data = getQuestionData(questionIndex);

    return (
      <View style={myStyle.parContainer} key={questionIndex}>
        <Text>Hello Paragraph {questionIndex}</Text>
      </View>
      );
  }


  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;
    const headerImage = require('../../../images/header_fallback.png');

    const paragraphs = [];
    for (let i = 0; i < getQuestionsCount(); ++i)
      paragraphs.push(this.renderParagraph(i));

    return (
      <ScrollView style={[flexible]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  >
        <Image style={content.header.container}
               source={headerImage}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              Il mio percorso{"\n"}di prevenzione
            </Text>
          </View>
        </Image>
        <View style={[content.body.container]}>
          {paragraphs}
        </View>
      </ScrollView>
      );
  }
}


const myStyle = StyleSheet.create({
  parContainer: {
    borderWidth: 1,
    borderColor: 'red',
  }
});
