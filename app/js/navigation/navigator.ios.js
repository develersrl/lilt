'use strict';

import React, { Component } from 'react';
import { NavigatorIOS, StyleSheet } from 'react-native';

import * as style from '../style';
import { getStartRoute } from './navigator_data';



export default class AppNavigator extends Component {
  render() {
    const { navigator } = style.pages;

    return (
      <NavigatorIOS
        style={navigator.ios}
        initialRoute={getStartRoute()}
        itemWrapperStyle={myStyle.wrapperStyle}
        />
    );
  }
}


const myStyle = StyleSheet.create({
  wrapperStyle: {
    // https://github.com/aksonov/react-native-router-flux/blob/master/src/NavBar.js#L66
    marginBottom: 50,
  },
});
