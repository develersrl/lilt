'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ModalPicker from 'react-native-modal-picker';

import { common } from '../style';


export default class PickerField extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { label, data, selectedValue, onChangeSelection } = this.props;

    return (
      <View style={myStyle.container}>
        <View style={myStyle.labelView}>
          <Text style={myStyle.label}>{label}</Text>
        </View>
        <ModalPicker style={myStyle.inputFieldView}
                     data={data}
                     initValue={'select'}
                     onChange={(opt) => console.log(opt.label)}>
          <TextInput style={myStyle.text}
                      editable={false}
                      placeholder={"seleziona"}
                      value={'Select Something'} />
        </ModalPicker>
      </View>
      );
  }
}


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
    borderRightWidth: 1,
    borderRightColor: '#BBBBBB',
  },
  label: {
    color: '#7B7A7A',
    fontWeight: 'bold',
  },
  inputFieldView: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  text: {
    height: form.fieldHeight,
    color: '#7B7A7A',
    fontSize: 22,
  },
  picker: {
    height: 220,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3B33',
  },
});
