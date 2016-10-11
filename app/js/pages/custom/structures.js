'use strict';

import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import { api as stateApi } from '../../state';
import { SegmentControl } from '../../blocks';

import { common, pages } from '../../style';
const { structures } = pages;


export default class Structures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      tabLabels: stateApi.getStructureTypes(),
    };
  }


  render() {
    const { selectedIndex, tabLabels } = this.state;

    return (
      <View style={myStyle.container}>
        <View style={myStyle.aboveView}>
          <Text style={myStyle.titleText}>STRUTTURE</Text>
          <Text style={myStyle.subtitleText}>
            Lorem ipsum dolor sit amet, consectetur adipicing elit.
            Nunc dapibus id orci feugiat vulputate.
          </Text>
        </View>
        <View style={myStyle.belowView}>
          <SegmentControl values={tabLabels}
                          selectedIndex={selectedIndex}
                          tintColor={structures.segmentsColor}
                          />
          <View style={myStyle.tabView}>

          </View>
        </View>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: common.statusBarHeight,
  },
  aboveView: {
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
  titleText: {
    color: '#FF9C8D',
    fontFamily: 'GillSans-Bold',
    fontSize: structures.titleFontSize,
    textAlign: 'center',
  },
  subtitleText: {
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: structures.titleSubtitleGap,
    fontFamily: 'GillSans',
    fontSize: structures.subtitleFontSize,
  },
  belowView: {
    flex: 1,
  },
  tabView: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'blue',
  },
});
