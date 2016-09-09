'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { common } from '../style';


export default class Button2 extends Component {
  render() {
    const { text, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={myStyle.container}>
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
    backgroundColor: '#C1DBF8',
    height: form.fieldHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});
