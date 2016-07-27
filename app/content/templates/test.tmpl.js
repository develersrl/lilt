'use strict';

import React, { Component } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

import * as style from '../style';
import * as blocks from '../blocks';


export default class Test extends Component {
  render() {
    const { flexible, centeredChildren, stretch, row } = style.common;
    const { markdown, image } = style.blocks;
    const { Button } = blocks;

    return (
      <View style={[flexible, centeredChildren]}>
        <View style={[flexible, stretch]}>
          {{testButton}}
        </View>

        {{testMarkdown}}

        {{testArray}}
      </View>
      );
  }
}
