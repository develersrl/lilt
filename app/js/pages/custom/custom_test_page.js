'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { common } from '../../style';


export default class StaticTestPage extends Component {
  render() {
    const { flexible, centeredChildren } = common;

    return (
      <View style={[flexible, centeredChildren]}>
        <Text>Hello Static Test Page!</Text>
      </View>
      );
  }
}
