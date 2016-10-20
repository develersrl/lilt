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

import { common, pages } from '../../style';
const { customPrevention: globSt } = pages;


export default class Content extends Component {
  renderParagraph(questionIndex) {
    const data = getQuestionData(questionIndex);
    const questionText = data.question;
    const answerText = stateApi.getSavedAnswerText(questionIndex);
    const answerValue = stateApi.getSavedAnswerValue(questionIndex);
    const ageRange = stateApi.getUserAgeRange();
    const paragraphText = stateApi.getParagraphFromUserAnswer(
      questionIndex, answerValue, ageRange);

    const containerStyle = [myStyle.parContainer];
    if (questionIndex > 0)
      containerStyle.push(myStyle.parSpacing);

    return (
      <View style={containerStyle} key={questionIndex}>
        <Text style={myStyle.question}>{questionText}</Text>
        <Text style={myStyle.answer}>{answerText}</Text>
        <Text style={myStyle.parText}>
          {paragraphText}
        </Text>
      </View>
      );
  }


  renderQuestionnaireWarningParagraph() {
    return (
      <View>
        <Text style={myStyle.parTitle}>
          Screening mammografico, Attività fisica..
        </Text>
        <Text style={myStyle.parText}>
          Potrai visualizzare consigli personalizzati riguardo a questi ed
          altri argomenti una volta completato il questionario LILT!
        </Text>
        <View style={{height: 5}} />
        <Text style={myStyle.parText}>
          Puoi accedere al questionario dal tuo profilo.
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


  renderBMIWarningParagraph() {
    return (
      <View>
        <Text style={[myStyle.parTitle, myStyle.parSpacing]}>
          Peso e Alimentazione
        </Text>
        <Text style={myStyle.parText}>
          Per visualizzare consigli personalizzati su peso ed alimentazione
          inserisci il tuo peso e la tua altezza dalla pagina di profilo.
        </Text>
      </View>
      );
  }


  renderBMIParagraph() {
    if (!stateApi.isBMIAvailable())
      return this.renderBMIWarningParagraph();

    const bmiRange = stateApi.getUserBMIRange();
    const paragraphText = stateApi.getParagraphForBMIRange(bmiRange);

    return (
      <View>
        <Text style={[myStyle.answer, myStyle.parSpacing]}>
          Peso e Alimentazione
        </Text>
        <Text style={myStyle.parText}>
          {paragraphText}
        </Text>
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
          {this.renderBMIParagraph()}
        </View>
      </ScrollView>
      );
  }
}


const myStyle = StyleSheet.create({
  parContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
  },
  parSpacing: {
    marginTop: globSt.paragraphSpacing,
  },
  parTitle: {
    fontFamily: 'GillSans-Bold',
    fontSize: globSt.headerFontSize,
    color: globSt.headerColor,
    marginBottom: 10,
  },
  parText: {
    fontFamily: 'GillSans',
    fontSize: globSt.textFontSize,
    color: globSt.textColor,
  },
  question: {
    fontFamily: 'GillSans',
    fontSize: globSt.questionFontSize,
    color: globSt.questionColor,
    fontStyle: 'italic',
  },
  answer: {
    fontFamily: 'GillSans-Bold',
    fontSize: globSt.headerFontSize,
    color: globSt.headerColor,
    marginBottom: 10,
  },
});
