'use strict';

import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';

import * as style from './style';
import { getStartRoute } from './navigator_data';


export default class Navigator extends Component {
  render() {
    const { flexible } = style.common;
    const { navigator } = style.pages;

    return (
      <NavigatorIOS style={[flexible, navigator.nav]}
                    itemWrapperStyle={navigator.wrapped}
                    initialRoute={getStartRoute()} />
      );
  }
}
