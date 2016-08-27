'use strict';

import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { common, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren, debug, debug1, debug2 } = common;
    const { content } = pages;

    return (
      <View style={[flexible]}>
        <Image style={content.header.container}
               source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Inside_the_Batad_rice_terraces.jpg'}}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              Hello Title!
            </Text>
          </View>
          <View style={[content.header.footer]}>
            <View style={content.header.actionView}>
              <Text style={content.header.text}>Dwnl</Text>
            </View>
            <View style={content.header.separator} />
            <View style={content.header.actionView}>
              <Text style={content.header.text}>Share</Text>
            </View>
          </View>
        </Image>
        <View style={[content.body, centeredChildren, debug2]}>
          <Text>Hello Text + Images!</Text>
        </View>
      </View>
      );
  }
}
