'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
} from 'react-native';

import { state, api } from '../../state';
import { TextInput, Button2, PickerField } from '../../blocks';
import { common } from '../../style';


export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { ...state.user.data },
      error: 'OK',
    };
  }


  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }


  onFieldChange(field, text) {
    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        [field]: text,
      }
    });
  }


  onSendPress() {
    const error = api.userValidate(this.state.user);
    this.setState({ ...this.state, error });

    if (error === 'OK') {
      api.userRegister(this.state.user);
    }
  }


  renderErrorString() {
    const { error } = this.state;

    if (error === 'OK')
      return null;

    return (
      <Text style={myStyle.errorText}>{error}</Text>
      );
  }


  render() {
    const { email, name, surname, address, age, cap } = this.state.user;
    const cb = this.onFieldChange.bind(this);
    const makeCb = (field) => (text) => cb(field, text);
    const makePickerCb = (field) => (opt) => cb(field, opt.label);

    const ageData = [
      { key: 0, label: 'meno di 45 anni' },
      { key: 1, label: '45-50 anni' },
      { key: 2, label: '50-69 anni' },
      { key: 3, label: '70-74 anni' },
    ];

    const capData = [
      { key: 0, label: '50121' },
      { key: 1, label: '50122' },
      { key: 2, label: '50144' },
      { key: 3, label: '50145' },
    ];

    return (
      <ScrollView style={common.flexible} bounces={false}>
        <View>
          <Text style={myStyle.subTitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nunc dapibus id orci feugiat vulputate. Fusce quis bibendum erat.
            Donec pretium convallis consectetur.
          </Text>
        </View>
        <View style={myStyle.formContainer}>
          <TextInput label={'email'}
                     defaultValue={email}
                     onChangeText={makeCb('email')}
                     />
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
                       data={capData}
                       selectedValue={cap}
                       onChange={makePickerCb('cap')}
                       />
          <TextInput label={'indirizzo'}
                     defaultValue={address}
                     onChangeText={makeCb('address')}
                     />
          {this.renderErrorString()}
          <View style={myStyle.buttonView}>
            <Button2 text={'INVIA'} onPress={this.onSendPress.bind(this)}/>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-end',
    paddingBottom: 10,
  },
  buttonView: {
    alignSelf: 'flex-end',
    width: 100,
  },
});
