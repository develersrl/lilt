'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import { blocks } from '../style';
const { answer } = blocks;


export default class Answer extends Component {
  onAnswerPress() {
    if (this.props.onPress)
      this.props.onPress();
  }


  renderSelected() {
    const { selected } = this.props;
    const radioStyle = [myStyle.selected];
    if (this.props.disabled)
      radioStyle.push(myStyle.selectedDisabled);

    if (selected)
      return <View style={radioStyle} />;

    return null;
  }


  render() {

    const circleStyle = [myStyle.circle];
    if (this.props.disabled)
      circleStyle.push(myStyle.circleDisabled);

    const answerStyle = [myStyle.answerView];
    if (this.props.disabled)
      answerStyle.push(myStyle.answerViewDisabled);

    return (
      <View style={myStyle.container}>
        <TouchableHighlight style={myStyle.circleView}
                            underlayColor={answer.selectionUnderlay}
                            onPress={this.onAnswerPress.bind(this)}>
          <View style={circleStyle}>
            {this.renderSelected()}
          </View>
        </TouchableHighlight>
        <View style={answerStyle}>
          <Text style={myStyle.text}>
            {this.props.text}
          </Text>
        </View>
      </View>
      );
  }
}


Answer.propTypes = {
  text: React.PropTypes.string.isRequired,
  selected: React.PropTypes.bool.isRequired,
  disabled: React.PropTypes.bool,
  onPress: React.PropTypes.func,
};


const myStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  circleView: {
    width: answer.circleViewWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderWidth: 1,
    borderColor: '#8E8E8E',
    width: answer.circleWidth,
    height: answer.circleWidth,
    borderRadius: answer.circleWidth / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  circleDisabled: {
    backgroundColor: '#CCCCCC',
  },
  answerView: {
    flex: 1,
    backgroundColor: answer.backgroundColor,
    justifyContent: 'center',
    padding: answer.answerPadding,
  },
  answerViewDisabled: {
    backgroundColor: '#8E8E8E',
  },
  text: {
    color: answer.color,
    fontFamily: 'GillSans-Bold',
    fontSize: answer.fontSize,
  },
  selected: {
    width: answer.circleWidth / 2,
    height: answer.circleWidth / 2,
    borderRadius: answer.circleWidth / 4,
    backgroundColor: 'black',
  },
  selectedDisabled: {
    backgroundColor: '#8E8E8E',
  },
});
