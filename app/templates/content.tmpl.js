'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { openPdf, openURL, share } from '../../misc';
import { Stripe } from '../../blocks';
import { common, blocks, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;
    const { markdown } = blocks;
    const pdfName = "{{pdfName}}";
    const headerImage = {{headerImage}};
    const sharedText = `{{sharedText}}`;

    return (
      <ScrollView style={[flexible, content.marginTop]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  >
        <Image style={content.header.container}
               source={headerImage}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              {{title}}
            </Text>
          </View>
          <View style={[content.header.footer]}>
            <TouchableOpacity style={content.header.actionView}
                              onPress={() => openPdf(pdfName)}>
              <Image style={content.header.actionImg}
                     source={require('../../../images/download.png')} />
            </TouchableOpacity>
            <View style={content.header.separator} />
            <TouchableOpacity style={content.header.actionView}
                              onPress={() => share(sharedText)}>
              <Image style={content.header.actionImg}
                     source={require('../../../images/share.png')} />
            </TouchableOpacity>
          </View>
        </Image>
        <View style={[content.body.container]}>
          {{body}}
        </View>
      </ScrollView>
      );
  }
}
