'use strict';

import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import { common } from '../../style';


export default class Structures extends Component {
  render() {
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
    fontSize: 13,
    textAlign: 'center',
  },
  subtitleText: {
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'GillSans',
    fontSize: 13,
  },
  belowView: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'blue',
  },
});
