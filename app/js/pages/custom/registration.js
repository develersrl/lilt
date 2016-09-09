'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TextInput, Button2 } from '../../blocks';
import { common, pages } from '../../style';


export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Homer',
      surname: 'Simpson',
      address: 'Ciao',
    };
  }


  onChangeText(field, text) {
    this.setState({ ...this.state, [field]: text });
  }


  render() {
    const { name, surname, address } = this.state;
    const cb = this.onChangeText.bind(this);
    const makeCb = (field) => (text) => cb(field, text);

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
