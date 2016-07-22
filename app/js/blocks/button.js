'use strict';

import React, { Component } from 'react';
import { Text, TouchableHighlight } from 'react-native';

import * as style from '../style';


export default class Button extends Component {
  render() {
    const { flexible, centeredChildren, stretch } = style.common;
    const { button } = style.blocks;

    return (
      <TouchableHighlight style={[flexible, centeredChildren, stretch]}
                          {...this.props}
                          underlayColor={button.underlayColor}>
        <Text>{this.props.text}</Text>
      </TouchableHighlight>
      );
  }
}
