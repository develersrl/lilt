'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import * as style from '../style';
import * as blocks from '../blocks';


export default class Test extends Component {
  render() {
    const { flexible, centeredChildren, stretch, debug1 } = style.common;
    const { Button } = blocks;

    return (
      <View style={[flexible, centeredChildren]}>
        <View style={[flexible, stretch, centeredChildren, debug1]}>
          <Text>Hello Test Page!</Text>
        </View>
        <Button text={'Hello Button'} onPress={() => {}} />
      </View>
      );
  }
}
