'use strict';

import React, { Component } from 'react';

import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  api as stateApi,
  getQuestionsCount,
  getQuestionData,
} from '../../state';

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


  renderQuestionnaireWarningParagraph() {
    return (
      <View>
        <Text style={myStyle.parTitle}>
          Screening, Fumo, Fitness..
        </Text>
        <Text style={myStyle.parText}>
          Potrai visualizzare consigli personalizzati riguardo a questi ed
          altri argomenti una volta completato il questionario LILT!
        </Text>
        <View style={{height: 5}} />
        <Text style={myStyle.parText}>
          Puoi accedere al questionario LILT dalla pagina del tuo profilo.
        </Text>
      </View>
      );
  }


  renderQuestionnaireParagraphs() {
    if (!stateApi.isQuestionnaireDone())
      return this.renderQuestionnaireWarningParagraph();

    const paragraphs = [];
    for (let i = 0; i < getQuestionsCount(); ++i)
      paragraphs.push(this.renderParagraph(i));

    return (
      <View>
        {paragraphs}
      </View>
      );
  }


  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;
    const headerImage = require('../../../images/header_fallback.png');

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
          {this.renderQuestionnaireParagraphs()}
        </View>
      </ScrollView>
      );
  }
}


const myStyle = StyleSheet.create({
  parContainer: {
    borderWidth: 1,
    borderColor: 'red',
  },
  parTitle: {
    fontFamily: 'GillSans-Bold',
    fontSize: 18,
    color: '#494949',
    marginBottom: 10,
  },
  parText: {
    fontFamily: 'GillSans',
    fontSize: 16,
    color: '#8E8E8E',
  },
});
