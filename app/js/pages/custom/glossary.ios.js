// @flow
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import SearchBar from 'react-native-search-bar';
import TableView from 'react-native-tableview';

import * as style from '../../style';


export default class Glossary extends Component {
  constructor(props: any) {
    super(props);
    this._searchBar = null;
    this.state = { filterArgs: null, searchFocused: false };
  }

  onChangeSearchText(text) {
    this.setState({ filterArgs: text === '' ? null : [text] });
  }

  clearFilter() {
    this.setState({ ...this.state, filterArgs: null });
  }

  setSearchFocus(b) {
    this.setState({ ...this.state, searchFocused: b });
  }

  render() {
    const { flexible } = style.common;
    const filterStr = `label CONTAINS[d] %@`;

    return (
      <View style={[flexible]}>
        <SearchBar ref={(c) => this._searchBar = c}
                   placeholder={'Cerca'}
                   showsCancelButton={this.state.searchFocused}
                   onChangeText={this.onChangeSearchText.bind(this)}
                   onSearchButtonPress={() => this._searchBar.blur()}
                   onCancelButtonPress={this.clearFilter.bind(this)}
                   onFocus={() => this.setSearchFocus(true)}
                   onBlur={() => this.setSearchFocus(false)}/>
        <TableView tableViewStyle={TableView.Consts.Style.Plain}
                   tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
                   style={flexible}
                   showIndexList={this.state.filterArgs === null}
                   json={"glossary"}
                   filter={filterStr}
                   filterArgs={this.state.filterArgs}
                   showEmptySections={false}>
        </TableView>
      </View>
      );
  }
}
