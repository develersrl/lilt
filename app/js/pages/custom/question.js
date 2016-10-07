'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { api as stateApi } from '../../state';
import { Answer, ArrowMenu } from '../../blocks';
import { pages, common } from '../../style';
const { question } = pages;


export default class Question extends Component {
  constructor(props) {
    super(props);
    const { targetField, answers } = this.props;
    const answer = stateApi.getAnswer(targetField);
    let index = -1;

    if (answer !== null && answer !== '') {
      for (let i = 0; i < answers.length; ++i) {
        if (answers[i].value === answer) {
          index = i;
          break;
        }
      }
    }

    this.state = { selectedIndex: index };
  }

  onAnswerSelected(idx) {
    this.setState({ selectedIndex: idx });
  }


  onForwardPress() {
    // Note: if this callback is fired there is always a valid selection
    const {
      answers,
      targetField,
      questionIndex,
      questionsCount,
      navigator,
      getRoute,
    } = this.props;
    const answerValue = answers[this.state.selectedIndex].value;

    // Save selected answer in answers "working copy"
    stateApi.saveAnswer(targetField, answerValue);

    if (questionIndex < questionsCount - 1) {
      // If there is another question then switch page
      const nextQuestionRoute = '__question' + (questionIndex + 1) + '__';
      navigator.push(getRoute(nextQuestionRoute));
    }
    else {
      // If we are on the last question page
      stateApi.answersRegister()
        .then(() => navigator.push(getRoute('answersThanks')));
    }
  }


  renderQuestion() {
    const { questionIndex } = this.props;

    return (
      <View>
        <Text style={myStyle.questionTitle}>DOMANDA {questionIndex + 1}</Text>
        <Text style={myStyle.questionText}>
          {this.props.questionText}
        </Text>
      </View>
      );
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
    const { answers } = this.props;

    return (
      <View>
        {answers.map((a, idx) => this.renderAnswer.bind(this)(a.text, idx))}
      </View>
      );
  }


  renderBottomBarCircle(idx) {
    const { questionIndex } = this.props;
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
    const { questionsCount } = this.props;
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
    const { questionIndex, questionsCount } = this.props;
    const enabled = (this.state.selectedIndex >= 0);
    const lastQuestion = (questionIndex === questionsCount - 1);

    return <ArrowMenu style={myStyle.arrowMenu}
                      text={lastQuestion ? 'Fine' : 'Avanti'}
                      enabled={enabled}
                      onPress={this.onForwardPress.bind(this)}
                      />;
  }


  render() {
    return (
      <ScrollView style={myStyle.container}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  contentInset={{bottom: common.tabBarHeight}}
                  >
        {this.renderQuestion()}
        {this.renderAnswers()}
        {this.renderBottomBar()}
        {this.renderArrow()}
      </ScrollView>
      );
  }
}


Question.propTypes = {
  questionText: React.PropTypes.string.isRequired,
  answers: React.PropTypes.arrayOf(React.PropTypes.shape({
    text: React.PropTypes.string,
    value: React.PropTypes.string,
  })).isRequired,
  questionsCount: React.PropTypes.number.isRequired,
  questionIndex: React.PropTypes.number.isRequired,
  targetField: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: question.backgroundColor,
    padding: question.bodyPadding,
  },
  questionTitle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'GillSans-Bold',
    fontSize: question.questionTitleFontSize,
    padding: 20,
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
  arrowMenu: {
    justifyContent: 'flex-end',
  },
});
