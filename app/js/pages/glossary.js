// @flow
'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import SearchBar from 'react-native-search-bar';
import TableView from 'react-native-tableview';

import * as style from '../style';


export default class Glossary extends Component {
  constructor(props: any) {
    super(props);
  }

  componentWillMount() {

  }

  render() {
    const { searchView } = style.pages.glossary;
    const { flexible, debug1, debug2 } = style.common;
    const { Section, Item } = TableView;

    return (
      <View style={[flexible]}>
        <SearchBar placeholder={'Cerca'} />
        <TableView style={[flexible, debug2]}>
          <Section label="A">
            <Item value="AAA" detail="Detail1">AAA</Item>
          </Section>
          <Section label="B">
            <Item value="BBB" detail="Detail1">AAA</Item>
          </Section>
        </TableView>
      </View>
      );
  }
}
