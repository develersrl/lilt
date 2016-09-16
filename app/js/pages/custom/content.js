'use strict';

import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import { openPdf, share } from '../../misc';
import { Stripe } from '../../blocks';
import { common, pages } from '../../style';


export default class Content extends Component {
  render() {
    const { flexible, centeredChildren, debug2 } = common;
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
              <TouchableOpacity onPress={() => openPdf('pdf-sample.pdf')}>
                <Text style={content.header.text}>PDF</Text>
              </TouchableOpacity>
            </View>
            <View style={content.header.separator} />
            <View style={content.header.actionView}>
              <TouchableOpacity onPress={() => share('sample text')}>
                <Text style={content.header.text}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Image>
        <View style={[content.body, centeredChildren, debug2]}>
          <Text>Hello Text + Images!</Text>
        </View>
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
      </View>
      );
  }
}
