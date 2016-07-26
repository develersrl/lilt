'use strict';

import React, { Component } from 'react';
import { Text, TouchableHighlight } from 'react-native';

import * as style from '../style';


export default class Button extends Component {
  render() {
    const { button } = style.blocks;

    return (
      <TouchableHighlight style={button.css}
                          {...this.props}
                          underlayColor={button.underlayColor}>
        <Text>{this.props.text}</Text>
      </TouchableHighlight>
      );
  }
}
