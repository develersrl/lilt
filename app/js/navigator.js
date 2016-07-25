'use strict';

import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';

import { StartPage } from './pages';
import * as style from './style';


export default class Navigator extends Component {
  render() {
    const { flexible } = style.common;
    const { navigator } = style.pages;

    return (
      <NavigatorIOS style={[flexible, navigator.nav]}
                    itemWrapperStyle={navigator.wrapped}
                    initialRoute={{component: StartPage, title: 'My Title'}} />
      );
  }
}
