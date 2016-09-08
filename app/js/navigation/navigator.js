'use strict';

import React, { Component } from 'react';
import { Navigator, Text, TouchableHighlight } from 'react-native';

import * as style from '../style';
import { getStartRoute } from './navigator_data';


const navBarMapper = {
  LeftButton: (route, navigator, index /* , navState */) => {
    return (
      <TouchableHighlight
        onPress={() => {
          if (index > 0)
            navigator.jumpBack();
        }}>
        <Text>Back</Text>
      </TouchableHighlight>
    );
  },
  RightButton: (route, navigator /* , index, navState */) => {
    return (
      <TouchableHighlight
        onPress={() => {
          // if the current route is the last one, we can't jump forward
          if (route !== navigator.getCurrentRoutes().slice(-1)[0]) {
            navigator.jumpForward();
          }
        }}>
        <Text>Forward</Text>
      </TouchableHighlight>
    );
  },
  Title: (route /* , navigator, index, navState */) => {
    return (
      <Text>{route.title}</Text>
      );
  }
};


export default class AppNavigator extends Component {
  render() {
    const { flexible } = style.common;
    const { navigator } = style.pages;

    return (
      <Navigator
        style={[flexible, navigator.nav]}
        itemWrapperStyle={navigator.wrapped}
        initialRoute={getStartRoute()}
        navigationBar={
          <Navigator.NavigationBar
            style={navigator.nav}
            routeMapper={navBarMapper}
          />
        }
        renderScene={(route, navigator) => {
          return (
            <route.component navigator={navigator} {...route.passProps}/>
            );
        }}
      />
    );
  }
}
