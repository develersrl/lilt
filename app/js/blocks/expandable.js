// @flow
'use strict';

import React from 'react';
import { View, Text, Image } from 'react-native';

import * as style from '../style';


export default React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  render() {
    const {
      container,
      titleView,
      signImg,
      titleTextView
    } = style.block.expandable;

    const { centeredChildren, mediumText } = style.common;

    return (
      <View style={container}>
        <View style={titleView}>
          <View style={centeredChildren}>
            <Image style={signImg}
                   source={require('../../images/plus.png')} />
          </View>
          <View style={titleTextView}>
            <Text style={mediumText}>Hello Expandable!</Text>
          </View>
        </View>
      </View>
      );
  }
});
