'use strict';

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { common, blocks } from '../style';


export default class LinkListItem extends Component {
  render() {
    const { title, caption, onLinkPress, showSeparator } = this.props;
    const { linkListItem } = blocks;

    let separator = null;
    if (showSeparator)
      separator = (<View style={linkListItem.separator} />);

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
        {separator}
      </View>
      );
  }
}
