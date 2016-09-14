'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

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
          <Navigator.NavigationBar style={navigator.nav}
                                   routeMapper={navBarMapper} />
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
