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

import { openPdf, share } from '../../misc';
import { Stripe } from '../../blocks';
import { common, blocks, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;
    const { markdown } = blocks;
    const pdfName = "{{pdfName}}";
    const headerImage = {{headerImage}};
    const sharedText = "{{sharedText}}";
    const st = {bottom: 59};

    return (
      <ScrollView style={[flexible]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  contentInset={st}
                  >
        <Image style={content.header.container}
               source={headerImage}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              {{title}}
            </Text>
          </View>
          <View style={[content.header.footer]}>
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => openPdf(pdfName)}>
                <Image style={content.header.actionImg}
                       source={require('../../../images/download.png')} />
              </TouchableOpacity>
            </View>
            <View style={content.header.separator} />
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => share(sharedText)}>
                <Image style={content.header.actionImg}
                       source={require('../../../images/share.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </Image>
        <View style={[content.body.container]}>
          {{body}}
        </View>
      </ScrollView>
      );
  }
}
