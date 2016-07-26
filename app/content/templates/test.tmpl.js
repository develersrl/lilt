'use strict';

import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';

import * as style from '../style';
import * as blocks from '../blocks';


export default class Test extends Component {
  render() {
    const { flexible, centeredChildren, stretch } = style.common;
    const { markdown } = style.blocks;
    const { Button } = blocks;

    return (
      <View style={[flexible, centeredChildren]}>
        <View style={[flexible, stretch, centeredChildren]}>
          {{testMarkdown}}
        </View>
        {{testButton}}
      </View>
      );
  }
}
