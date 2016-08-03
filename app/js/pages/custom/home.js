'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { api as stateApi } from '../../state';
import * as style from '../../style';
import { Button } from '../../blocks';


export default class Home extends Component {
  componentWillMount() {
    stateApi.init();
  }

  render() {
    const { flexible, centeredChildren } = style.common;
    const { navigator, getRoute } = this.props;

    return (
      <View style={[flexible, centeredChildren]}>
        <View style={centeredChildren}>
          <Text style={{marginBottom: 10}}>Hello Home!</Text>
          <Button text="Go to Generated Page"
                  onPress={() => navigator.push(getRoute('#9'))} />
          <View style={{height: 10}} />
          <Button text="Go to Test Page"
                  onPress={() => navigator.push(getRoute('test'))} />
        </View>
      </View>
      );
  }
}
