'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class Expandable extends Component {
  render() {
    return (
      <View {...this.props}>
        <Text>Hello Expandable!</Text>
      </View>
      );
  }
}
