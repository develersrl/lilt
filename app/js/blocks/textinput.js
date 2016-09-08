'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';


export default class MyTextInput extends Component {
  render() {
    const { label, defaultValue, onChangeText } = this.props;

    return (
      <View style={myStyle.container}>
        <View style={myStyle.labelView}>
          <Text style={myStyle.label}>{label}</Text>
        </View>
        <View style={myStyle.inputFieldView}>
          <TextInput style={myStyle.inputField}
                     defaultValue={defaultValue}
                     onChangeText={onChangeText}/>
        </View>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    flexDirection: 'row',
    marginBottom: 10,
  },
  labelView: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  label: {
    color: '#7B7A7A',
    fontWeight: 'bold',
  },
  inputFieldView: {
    flex: 1,
    justifyContent: 'center',
  },
  inputField: {
    flex: 1,
    color: '#7B7A7A',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
