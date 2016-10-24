'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { common } from '../style';


export default class Button2 extends Component {
  onInternalPress() {
    const { disabled, onPress } = this.props;
    if (!disabled)
      onPress();
  }


  render() {
    const { text, disabled } = this.props;

    const containerStyle = [myStyle.container];
    if (disabled)
      containerStyle.push(myStyle.disabled);

    return (
      <TouchableOpacity style={containerStyle}
                        onPress={this.onInternalPress.bind(this)}>
        <View>
          <Text style={myStyle.text}>{text}</Text>
        </View>
      </TouchableOpacity>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74B3FA',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#C1DBF8',
  },
  text: {
    color: 'white',
    fontFamily: 'GillSans',
    fontSize: 14,
  },
});
