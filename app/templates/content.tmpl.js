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
import { common, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;
    const headerImage = {{headerImage}};

    const shareText = "{{shareText}}";

    return (
      <ScrollView style={[flexible]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}>
        <Image style={content.header.container}
               source={headerImage}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              {{title}}
            </Text>
          </View>
          <View style={[content.header.footer]}>
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => openPdf({{pdfName}})}>
                <Image style={content.header.actionImg}
                       source={require('../../../images/download.png')} />
              </TouchableOpacity>
            </View>
            <View style={content.header.separator} />
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => share(shareText)}>
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


const markdown = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: 'GillSans-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    borderWidth: 1,
    borderColor: '#0000FF',
    resizeMode: 'contain',
    height: 100,
    width: 150,
  },
});
