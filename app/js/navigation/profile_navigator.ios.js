'use strict';

import React, { Component } from 'react';
import { NavigatorIOS, StyleSheet } from 'react-native';

import * as style from '../style';
import { getStartRoute } from './profile_navigator_data';



export default class ProfileNavigator extends Component {
  render() {
    const { flexible } = style.common;
    const { navigator } = style.pages;

    return (
      <NavigatorIOS
        style={[flexible, navigator.nav]}
        initialRoute={getStartRoute()}
        itemWrapperStyle={myStyle.wrapperStyle}
        />
    );
  }
}


const myStyle = StyleSheet.create({
  wrapperStyle: {
    /*
    borderWidth: 1,
    borderColor: 'red',
    */
    // https://github.com/aksonov/react-native-router-flux/blob/master/src/NavBar.js#L66
    marginTop: 44,
    marginBottom: 50,
  },
});
