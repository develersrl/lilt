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
    this._searchBar = null;
    this.state = { filterArgs: null };
  }

  onChangeSearchText(text) {
    this.setState({ filterArgs: text === '' ? null : [text] });
  }

  hideSearchBar() {
    this._searchBar.blur();
  }

  render() {
    const { flexible } = style.common;
    const filterStr = `label CONTAINS[cd] %@`;

    return (
      <View style={[flexible]}>
        <SearchBar ref={(c) => this._searchBar = c}
                   placeholder={'Cerca'}
                   onChangeText={this.onChangeSearchText.bind(this)}
                   onSearchButtonPress={this.hideSearchBar.bind(this)}
                   onCancelButtonPress={this.hideSearchBar.bind(this)} />
        <TableView tableViewStyle={TableView.Consts.Style.Plain}
                   tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
                   style={flexible}
                   detailFontSize={9}
                   showIndexList={this.state.filterArgs === null}
                   json="glossary"
                   filter={filterStr}
                   filterArgs={this.state.filterArgs}
                   showEmptySections={false}>
        </TableView>
      </View>
      );
  }
}
