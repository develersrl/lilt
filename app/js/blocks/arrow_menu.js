'use strict';

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { blocks } from '../style';
const { arrowMenu } = blocks;


export default class ArrowMenu extends Component {
  onPress() {
    if (this.props.onPress)
      this.props.onPress();
  }


  render() {
    const { enabled, style } = this.props;
    const pressCb = enabled ? this.onPress.bind(this) : null;
    let arrowImg = null;
    const textStyle = [myStyle.text];

    if (enabled) {
      arrowImg = require('../../images/arrow2.png');
      textStyle.push(myStyle.textEnabled);
    }
    else {
      arrowImg = require('../../images/arrow2_gray.png');
      textStyle.push(myStyle.textDisabled);
    }

    return (
      <TouchableOpacity style={[myStyle.container, style]}
                        activeOpacity={arrowMenu.activeOpacity}
                        onPress={pressCb}>
        <View style={myStyle.textView}>
          <Text style={textStyle}>{this.props.text}</Text>
        </View>
        <Image style={myStyle.arrowImage} source={arrowImg} />
      </TouchableOpacity>
      );
  }
}


ArrowMenu.propTypes = {
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
  enabled: React.PropTypes.bool,
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
};


const myStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  arrowImage: {
    width: arrowMenu.imageWidth,
    height: arrowMenu.imageWidth,
    resizeMode: 'contain',
  },
  textView: {
    justifyContent: 'center',
    marginRight: arrowMenu.textGap,
  },
  text: {
    textAlign: 'center',
    color: arrowMenu.textColor,
    fontFamily: 'GillSans-Light',
    fontSize: arrowMenu.fontSize,
  },
  textEnabled: {
    color: arrowMenu.textColor,
  },
  textDisabled: {
    color: arrowMenu.textDisabledColor,
  },
});
