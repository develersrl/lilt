'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { common } from '../style';


export default class Button2 extends Component {
  render() {
    return (
      <View style={myStyle.container}>
        <Text>Hello Button!</Text>
      </View>
      );
  }
}


const { form } = common;
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    height: form.fieldHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
