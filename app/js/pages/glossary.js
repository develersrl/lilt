// @flow
'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import SearchBar from 'react-native-search-bar';

import * as style from '../style';


export default class Glossary extends Component {
  render() {
    const { container, searchView } = style.pages.glossary;
    const { debug, debug1 } = style.common;

    return (
      <View style={[container, debug]}>
        <View style={[searchView, debug1]}>
          <SearchBar />
        </View>
        <Text>Hello Glossary!</Text>
      </View>
      );
  }
}
