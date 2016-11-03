'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

import { common, blocks } from '../style';


export default class MyTextInput extends Component {
  render() {
    const {
      label,
      defaultValue,
      onChangeText,
      keyboardType,
      mandatory,
      placeholder,
      capitalize,
    } = this.props;

    const _keyboardType = keyboardType === undefined ? 'default' : keyboardType;

    let asterisk = null;
    if (mandatory)
      asterisk = (<Text style={[myStyle.label, myStyle.asterisk]}>*</Text>);

    return (
      <View style={[myStyle.container, this.props.style]}>
        <View style={myStyle.labelView}>
          <Text>
            <Text style={myStyle.label}>{label}</Text>
            {asterisk}
          </Text>
        </View>
        <View style={myStyle.inputFieldView}>
          <TextInput style={myStyle.inputField}
                     defaultValue={defaultValue}
                     onChangeText={onChangeText}
                     keyboardType={_keyboardType}
                     placeholder={placeholder}
                     autoCapitalize={capitalize ? 'sentences' : 'none'}
                     autoCorrect={false}
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
  mandatory: React.PropTypes.bool,
  capitalize: React.PropTypes.bool.isRequired,
  placeholder: React.PropTypes.string,
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
};


MyTextInput.defaultProps = {
  capitalize: true,
};


const { form } = common;
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: form.fieldHeight,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    flexDirection: 'row',
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
  asterisk: {
    color: blocks.tabbar.barColor,
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
