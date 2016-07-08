'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class MDComponent extends Component {
  render() {
    return (
      <View>
        <Text style={{fontWeight: 'bold'}}><Text>Test Markdown Page</Text></Text><View><Text>Hello World</Text><Text>!</Text></View>
      </View>
      );
  }
}
