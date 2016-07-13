// @flow
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import SearchBar from 'react-native-search-bar';
import TableView from 'react-native-tableview';

import * as style from '../style';


export default class Glossary extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { flexible, debug2 } = style.common;

    return (
      <View style={[flexible]}>
        <SearchBar placeholder={'Cerca'} />
        <TableView style={[flexible, debug2]} json="glossary">
        </TableView>
      </View>
      );
  }
}
