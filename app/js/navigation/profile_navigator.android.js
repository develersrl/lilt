'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

import { Transitions } from '../misc';
import * as style from '../style';
import { getStartRoute } from './profile_navigator_data';


export default class AppNavigator extends Component {
  render() {
    const { navigator } = style.pages;

    return (
      <Navigator
        style={navigator.android.nav}
        itemWrapperStyle={navigator.wrapped}
        initialRoute={getStartRoute()}
        configureScene={() => Transitions.NONE}
        renderScene={(route, navigator) => {
          return (
            <route.component navigator={navigator} {...route.passProps}/>
            );
        }}
      />
    );
  }
}
