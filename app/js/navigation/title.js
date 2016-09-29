'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class Title extends Component {
  render() {
    const { route } = this.props;
    const { passProps } = route;
    const { barVisible } = passProps;
    const showBar = (barVisible === undefined || barVisible);

    if (!showBar)
      return null;

    return (
      <View>
        <Text>{this.props.route.title}</Text>
      </View>
      );
  }
}
