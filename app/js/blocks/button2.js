'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { common } from '../style';


export default class Button2 extends Component {
  render() {
    const { text, onPress } = this.props;

    return (
      <TouchableOpacity style={myStyle.container} onPress={onPress}>
        <View>
          <Text style={myStyle.text}>{text}</Text>
        </View>
      </TouchableOpacity>
      );
  }
}


const { form } = common;
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74B3FA',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'GillSans',
    fontSize: 14,
  },
});
