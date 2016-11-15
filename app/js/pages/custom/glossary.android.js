// @flow
'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableOpacity,
} from 'react-native';

import { SearchAndroid } from '../../blocks';


export default class Glossary extends Component {
  constructor(props: any) {
    super(props);

    const glossaryWords = require('../../../content/glossary.json');
    const glossaryBlob = {};
    for (let i = 0; i < glossaryWords.length; ++i)
      glossaryBlob[glossaryWords[i].label] = glossaryWords[i].items;
    this.glossaryBlob = glossaryBlob;

    this.state = {
      dataSource: this.computeDataSource(''),
    };

    this.onSearchStringChange = this.onSearchStringChange.bind(this);
    this.onWordPress = this.onWordPress.bind(this);
  }


  computeDataSource(searchString) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    if (searchString === '')
      return ds.cloneWithRowsAndSections(this.glossaryBlob);

    const filteredBlob = {};
    const _searchString = searchString.toLowerCase();
    for (const letter in this.glossaryBlob) {
      const words = this.glossaryBlob[letter];
      const filteredWords = [];

      for (let i = 0; i < words.length; ++i)
        if (words[i].label.toLowerCase().includes(_searchString))
          filteredWords.push(words[i]);

      if (filteredWords.length > 0)
        filteredBlob[letter] = filteredWords;
    }

    return ds.cloneWithRowsAndSections(filteredBlob);
  }


  onSearchStringChange(searchString) {
    this.setState({ dataSource: this.computeDataSource(searchString) });
  }


  onWordPress(word) {
    const { navigator, getRouteForGlossaryWord } = this.props;
    navigator.push(getRouteForGlossaryWord(word));
  }


  renderSearchBar() {
    return (
      <SearchAndroid placeholder={'Cerca..'}
                     onChangeText={this.onSearchStringChange}
                     imageSource={require('../../../images/search.png')}
                     />
    );
  }


  renderListElement(isSectionHeader, text) {
    const viewStyle = [myStyle.wordView, isSectionHeader ? myStyle.sectionView : null];
    const textElement = <Text style={myStyle.wordText}>{text}</Text>;

    if (isSectionHeader) {
      return (
        <View style={viewStyle}>
          {textElement}
        </View>
      );
    }

    return (
      <TouchableOpacity style={viewStyle} onPress={() => this.onWordPress(text)}>
        <Text style={myStyle.wordText}>{text}</Text>
      </TouchableOpacity>
    );
  }


  renderWords() {
    return (
      <ListView style={myStyle.words}
                dataSource={this.state.dataSource}
                renderSectionHeader={(data, id) => this.renderListElement(true, id)}
                renderRow={(data) => this.renderListElement(false, data.label)}
                showsVerticalScrollIndicator={false}
                />
    );
  }


  render() {
    return (
      <View style={myStyle.container}>
        {this.renderSearchBar()}
        {this.renderWords()}
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  words: {
    flex: 1,
  },
  wordView: {
    justifyContent: 'center',
    height: 50,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  sectionView: {
    backgroundColor: '#FFE0D0',
  },
  wordText: {
    fontFamily: 'GillSans',
    fontSize: 18,
    color: '#444444',
  },
});
