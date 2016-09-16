'use strict';

import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';

import { openPdf, share } from '../../misc';
import { Stripe } from '../../blocks';
import { common, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren } = common;
    const { content } = pages;

    return (
      <ScrollView style={[flexible]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}>
        <Image style={content.header.container}
               source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Inside_the_Batad_rice_terraces.jpg'}}>
          <View style={[flexible, centeredChildren]}>
            <Text style={[content.header.titleText, content.header.text]}>
              Informazioni
            </Text>
          </View>
          <View style={[content.header.footer]}>
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => openPdf('pdf-sample.pdf')}>
                <Image style={content.header.actionImg}
                       source={require('../../../images/download.png')} />
              </TouchableOpacity>
            </View>
            <View style={content.header.separator} />
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => share('sample text')}>
                <Image style={content.header.actionImg}
                       source={require('../../../images/share.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </Image>
        <View style={[content.body.container]}>
          <Text style={content.body.text}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
          <Stripe
            imageSize={[800, 600]}
            sources={[
              require('../../../images/test.png'),
              require('../../../images/test.png'),
              require('../../../images/test.png'),
              require('../../../images/test.png'),
              require('../../../images/test.png'),
              require('../../../images/test.png'),
              require('../../../images/test.png'),
              require('../../../images/test.png'),
            ]} />
          <Text style={content.body.text}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
        </View>
      </ScrollView>
      );
  }
}
