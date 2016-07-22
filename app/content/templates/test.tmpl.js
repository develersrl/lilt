'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import * as style from '../style';


export default class Test extends Component {
  render() {
    const { flexible, centeredChildren } = style.common;

    return (
      <View style={[flexible, centeredChildren]}>
        <Text>Hello Test Page!</Text>
      </View>
      );
  }
}
