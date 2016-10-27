'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import { blocks, common } from '../style';
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
    const { flexible } = common;

    if (this.props.disabled) {
      return (
        <View style={myStyle.container}>
          <View style={myStyle.circleView}>
            <View style={[myStyle.circle, myStyle.circleDisabled]}>
              {this.renderSelected()}
            </View>
          </View>
          <View style={[myStyle.answerView, myStyle.answerViewDisabled]}>
            <Text style={myStyle.text}>
              {this.props.text}
            </Text>
          </View>
        </View>
        );
    }

    return (
      <View style={myStyle.container}>
        <TouchableHighlight style={myStyle.circleView}
                            underlayColor={answer.selectionUnderlay}
                            onPress={this.onAnswerPress.bind(this)}>
          <View style={myStyle.circle}>
            {this.renderSelected()}
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={flexible}
                            underlayColor={answer.selectionUnderlay}
                            onPress={this.onAnswerPress.bind(this)}>

          <View style={myStyle.answerView}>
            <Text style={myStyle.text}>
              {this.props.text}
            </Text>
          </View>
        </TouchableHighlight>
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
