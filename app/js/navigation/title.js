'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class Title extends Component {
  render() {
    const { route } = this.props;
    const { showBar } = route;
    const barVisible = (showBar === undefined || showBar);

    if (!barVisible)
      return null;

    return (
      <View>
        <Text>{this.props.route.title}</Text>
      </View>
      );
  }
}
