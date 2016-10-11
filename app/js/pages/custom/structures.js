'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';


export default class Structures extends Component {
  render() {
    const title = "STRUTTURE";

    return (
      <View style={myStyle.container}>
        <View style={myStyle.contentView}>
          <View style={myStyle.titleView}>
            <Text style={myStyle.titleText}>{title}</Text>
          </View>
        </View>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  backImg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 70,
    height: Dimensions.get('window').height,
    resizeMode: 'stretch',
  },
  contentView: {
    flex: 1,
    marginLeft: 60,
    marginRight: 20,
    justifyContent: 'center',
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleText: {
    color: '#FF9C8D',
    fontFamily: 'GillSans-Bold',
    fontSize: 13,
  },
});
