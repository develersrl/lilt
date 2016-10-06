'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

import { common } from '../style';


export default class MyTextInput extends Component {
  render() {
    const { label, defaultValue, onChangeText, keyboardType } = this.props;
    const _keyboardType = keyboardType === undefined ? 'default' : keyboardType;

    return (
      <View style={myStyle.container}>
        <View style={myStyle.labelView}>
          <Text style={myStyle.label}>{label}</Text>
        </View>
        <View style={myStyle.inputFieldView}>
          <TextInput style={myStyle.inputField}
                     defaultValue={defaultValue}
                     onChangeText={onChangeText}
                     keyboardType={_keyboardType}
                     />
        </View>
      </View>
      );
  }
}


MyTextInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  defaultValue: React.PropTypes.string.isRequired,
  onChangeText: React.PropTypes.func.isRequired,
  keyboardType: React.PropTypes.string,
};


const { form } = common;
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: form.fieldHeight,
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
