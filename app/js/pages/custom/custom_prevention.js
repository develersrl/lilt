'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
} from 'react-native';

import { common, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;
    const headerImage = require('../../../images/header_fallback.png');

    return (
      <ScrollView style={[flexible]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  >
        <Image style={content.header.container}
               source={headerImage}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              Il mio percorso{"\n"}di prevenzione
            </Text>
          </View>
        </Image>
        <View style={[content.body.container]}>
          <Text>Hello body!</Text>
        </View>
      </ScrollView>
      );
  }
}
