'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Answer, ArrowMenu } from '../../blocks';
import { pages } from '../../style';
const { question } = pages;


export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: -1 };
  }


  renderQuestion() {
    return (
      <View style={myStyle.questionView}>
        <Text style={myStyle.questionText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nunc dapibus id orci feugiat vulputate. Fusce quis bibendum erat.
          Donec pretium convallis consectetur.
        </Text>
      </View>
      );
  }


  onAnswerSelected(idx) {
    this.setState({ selectedIndex: idx });
  }


  renderAnswer(answerText, index) {
    return (
      <View key={index} style={myStyle.answerView}>
        <Answer text={answerText}
                selected={index === this.state.selectedIndex}
                onPress={() => this.onAnswerSelected.bind(this)(index)}
                />
      </View>
      );
  }


  renderAnswers() {
    const answers = [
      'Risposta 1',
      'Risposta 2',
      'Risposta 3',
      'Risposta 4',
    ];

    return (
      <View>
        {answers.map((txt, idx) => this.renderAnswer.bind(this)(txt, idx))}
      </View>
      );
  }


  renderBottomBarCircle(idx) {
    const questionIndex = 1;

    const circleStyle = [myStyle.circle];
    if (idx === questionIndex)
      circleStyle.push(myStyle.circleSelected);
    else
      circleStyle.push(myStyle.circleUnselected);

    if (idx > 0)
      circleStyle.push(myStyle.circleMargin);

    return <View key={idx} style={circleStyle} />;
  }


  renderBottomBar() {
    const questionsCount = 5;
    const circles = [];

    for (let i = 0; i < questionsCount; ++i)
      circles.push(this.renderBottomBarCircle(i));

    return (
      <View style={myStyle.bottomBarView}>
        {circles}
      </View>
      );
  }


  renderArrow() {
    const enabled = this.state.selectedIndex >= 0;
    return <ArrowMenu text={'Avanti'} enabled={enabled} />;
  }


  render() {
    return (
      <View style={myStyle.container}>
        {this.renderQuestion()}
        {this.renderAnswers()}
        {this.renderBottomBar()}
        {this.renderArrow()}
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: question.backgroundColor,
    padding: question.bodyPadding,
  },
  questionView: {
    padding: question.questionPadding,
  },
  questionText: {
    color: '#8E8E8E',
    textAlign: 'center',
    fontFamily: 'GillSans',
    fontSize: question.questionFontSize,
  },
  answerView: {
    marginTop: question.answersSpacing,
  },
  bottomBarView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: question.circlesPadding,
    flexDirection: 'row',
  },
  circle: {
    width: question.circlesWidth,
    height: question.circlesWidth,
    borderRadius: question.circlesWidth / 2,
  },
  circleMargin: {
    marginLeft: question.circlesSpacing,
  },
  circleUnselected: {
    backgroundColor: question.circleUnselectedColor,
  },
  circleSelected: {
    backgroundColor: question.circleSelectedColor,
  },
});
