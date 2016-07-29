'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import * as style from '../../style';
import * as blocks from '../../blocks';


export default class Test2 extends Component {
  render() {
    const { flexible, stretch } = style.common;
    const { Button } = blocks;

    return (
      <View style={[flexible, stretch]}>
        {{centralButton}}
      </View>
      );
  }
}
