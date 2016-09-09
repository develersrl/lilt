'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TextInput, Button2, PickerField } from '../../blocks';
import { common } from '../../style';


export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      address: '',
      age: '',
      cap: '',
    };
  }


  onChangeText(field, text) {
    this.setState({ ...this.state, [field]: text });
  }


  render() {
    const { name, surname, address, age, cap } = this.state;
    const cb = this.onChangeText.bind(this);
    const makeCb = (field) => (text) => cb(field, text);
    const makePickerCb = (field) => (opt) => cb(field, opt.label);

    const ageData = [
      { key: 0, label: 'primo' },
      { key: 1, label: 'secondo' },
      { key: 2, label: 'terzo' },
    ];

    return (
      <View style={common.flexible}>
        <View>
          <Text style={myStyle.subTitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nunc dapibus id orci feugiat vulputate. Fusce quis bibendum erat.
            Donec pretium convallis consectetur.
          </Text>
        </View>
        <View style={myStyle.formContainer}>
          <TextInput label={'nome'}
                     defaultValue={name}
                     onChangeText={makeCb('name')}
                     />
          <TextInput label={'cognome'}
                     defaultValue={surname}
                     onChangeText={makeCb('surname')}
                     />
          <PickerField label={'età'}
                       data={ageData}
                       selectedValue={age}
                       onChange={makePickerCb('age')}
                       />
          <PickerField label={'cap'}
                       data={ageData}
                       selectedValue={cap}
                       onChange={makePickerCb('cap')}
                       />
          <TextInput label={'indirizzo'}
                     defaultValue={address}
                     onChangeText={makeCb('address')}
                     />
          <View style={myStyle.buttonView}>
            <Button2 text={'INVIA'} onPress={() => console.log('press')}/>
          </View>
        </View>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  subTitle: {
    textAlign: 'center',
    padding: 40,
    color: '#7B7A7A',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingLeft: 40,
    paddingRight: 40,
  },
  buttonView: {
    alignSelf: 'flex-end',
    width: 100,
  },
});
