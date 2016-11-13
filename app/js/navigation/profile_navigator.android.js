'use strict';

import React, { Component } from 'react';
import { Navigator, BackAndroid } from 'react-native';

import { Transitions } from '../misc';
import * as style from '../style';
import { getStartRoute } from './profile_navigator_data';
import { api as stateApi } from '../state';


let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (stateApi.selectedTab() !== 'profile' || !_navigator) {
    return false;
  }
  if (_navigator.getCurrentRoutes().length === 1) {
    return false;
  }
  _navigator.pop();
  return true;
});


export default class ProfileNavigator extends Component {
  render() {
    const { navigator } = style.pages;

    return (
      <Navigator
        style={navigator.android.nav}
        itemWrapperStyle={navigator.wrapped}
        initialRoute={getStartRoute()}
        configureScene={() => Transitions.NONE}
        renderScene={(route, navigator) => {
          _navigator = navigator;
          return (
            <route.component navigator={navigator} {...route.passProps}/>
            );
        }}
      />
    );
  }
}
