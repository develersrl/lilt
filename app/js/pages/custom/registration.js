'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view';

import { api as stateApi } from '../../state';
import { TextInput, Button2, PickerField } from '../../blocks';
import { common, pages } from '../../style';
const { registerModify } = pages;


export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { ...stateApi.getState().user.data },
      error: 'OK',
    };
    stateApi.setListener(this);
  }


  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }


  onStateChange() {
    this.forceUpdate();
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
    const { navigator, getRoute } = this.props;
    const error = stateApi.userValidate(this.state.user);
    this.setState({ ...this.state, error });

    if (error === 'OK') {
      stateApi.userRegister(this.state.user)
        .then(() => navigator.push(getRoute('__question0__')));
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


  renderActivityIndicator() {
    if (stateApi.isSendingUserData())
      return (<ActivityIndicator size={'large'} />);
    return null;
  }


  render() {
    const { mode } = this.props;
    const { email, name, surname, address, age, cap } = this.state.user;
    const cb = this.onFieldChange.bind(this);
    const makeCb = (field) => (text) => cb(field, text);
    const makePickerCb = (field) => (opt) => cb(field, opt.label);
    let buttonText = 'INVIA E INIZIA QUESTIONARIO';
    let title = 'REGISTRAZIONE';
    if (mode === 'Edit') {
      buttonText = 'INVIA E RIPETI QUESTIONARIO';
      title = 'MODIFICA PROFILO';
    }

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
      <KeyboardAwareScrollView style={myStyle.container}
                               bounces={false}
                               showsVerticalScrollIndicator={false}
                               automaticallyAdjustContentInsets={false}
                               >
        <View style={myStyle.titleView}>
          <Text style={myStyle.titleText}>{title}</Text>
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
          <View style={myStyle.buttonRow}>
            <View style={myStyle.buttonView}>
              <Button2 text={buttonText}
                       onPress={this.onSendPress.bind(this)}/>
            </View>
            {this.renderActivityIndicator()}
          </View>
        </View>
      </KeyboardAwareScrollView>
      );
  }
}


Registration.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
  mode: React.PropTypes.oneOf(['Registration', 'Edit']).isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    paddingLeft: registerModify.paddingLeftRight,
    paddingRight: registerModify.paddingLeftRight,
  },
  titleText: {
    textAlign: 'center',
    fontFamily: 'GillSans-Bold',
    fontSize: 14,
    color: '#FF9C8D',
    padding: 20,
  },
  subTitle: {
    textAlign: 'center',
    color: '#8E8E8E',
    fontFamily: 'GillSans',
    fontSize: 15,
    lineHeight: 20,
    paddingLeft: registerModify.textPaddingLeftRight,
    paddingRight: registerModify.textPaddingLeftRight,
    paddingBottom: 20,
  },
  formContainer: {
    paddingLeft: registerModify.paddingLeftRight,
    paddingRight: registerModify.paddingLeftRight,
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-end',
    paddingBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    height: common.form.fieldHeight,
  },
  buttonView: {
    marginLeft: 10,
  },
});
