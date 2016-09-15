'use strict';

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { common, blocks } from '../style';


export default class LinkListItem extends Component {
  render() {
    const { title, caption, onLinkPress } = this.props;
    const { linkListItem } = blocks;

    return (
      <View>
        <View style={linkListItem.body}>
          <View style={linkListItem.row}>
            <Text style={linkListItem.title}>{title}</Text>
          </View>
          <View style={[linkListItem.row, linkListItem.captionRow]}>
            <Text style={linkListItem.caption}>
              {caption}
            </Text>
            <View style={linkListItem.linkView}>
              <TouchableOpacity onPress={onLinkPress}>
                <Image style={linkListItem.arrow}
                       source={require('../../images/arrow1.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={linkListItem.separator} />
      </View>
      );
  }
}
