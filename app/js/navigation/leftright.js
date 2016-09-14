'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class LeftRight extends Component {
  render() {
    const { route } = this.props;
    const { showBar } = route;
    const barVisible = (showBar === undefined || showBar);

    if (!barVisible)
      return null;

    return (
      <View>
        <Text>Hello Left Right</Text>
      </View>
      );
  }
}

/*
  //left
  return (
    <TouchableHighlight
      onPress={() => {
        if (index > 0)
          navigator.jumpBack();
      }}>
      <Text>Back</Text>
    </TouchableHighlight>
  );

  // right
  return (
    <TouchableHighlight
      onPress={() => {
        // if the current route is the last one, we can't jump forward
        if (route !== navigator.getCurrentRoutes().slice(-1)[0]) {
          navigator.jumpForward();
        }
      }}>
      <Text>Forward</Text>
    </TouchableHighlight>
  );
*/
