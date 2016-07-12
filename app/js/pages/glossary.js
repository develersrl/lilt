// @flow
'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import * as style from '../style';


export default class Glossary extends Component {
  render() {
    const { container } = style.pages.glossary;
    const { debug } = style.common;

    return (
      <View style={[container, debug]}>
        <Text>Hello Glossary!</Text>
      </View>
      );
  }
}
