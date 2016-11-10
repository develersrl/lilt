'use strict';

import React, { Component } from 'react';
import { Navigator, BackAndroid } from 'react-native';

import * as style from '../style';
import { getStartRoute } from './navigator_data';
import LeftRight from './leftright';
import Title from './title';


const navBarMapper = {
  LeftButton: (route, navigator, index, navState) => {
    return <LeftRight left={true}
                      route={route}
                      navigator={navigator}
                      index={index}
                      navState={navState} />;
  },
  RightButton: (route, navigator, index, navState) => {
    return <LeftRight left={false}
                      route={route}
                      navigator={navigator}
                      index={index}
                      navState={navState} />;
  },
  Title: (route, navigator, index, navState) => {
    return <Title route={route}
                  navigator={navigator}
                  index={index}
                  navState={navState} />;
  }
};

let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (!_navigator) {
    return false;
  }
  if (_navigator.getCurrentRoutes().length === 1) {
    return false;
  }
  _navigator.pop();
  return true;
});


export default class AppNavigator extends Component {
  render() {
    const { flexible } = style.common;
    const { navigator } = style.pages;

    return (
      <Navigator
        style={navigator.android.nav}
        itemWrapperStyle={navigator.wrapped}
        initialRoute={getStartRoute()}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
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
