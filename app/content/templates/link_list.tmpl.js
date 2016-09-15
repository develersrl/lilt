'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { LinkListItem, Button } from '../../blocks';
import { common } from '../../style';


export default class LinkList extends Component {
  render() {
    const { navigator, getRoute } = this.props;
    const { flexible } = common;

    const loremIpsum = "Lorem Ipsum is simply dummy text of the printing";

    return (
      <View style={[flexible]}>
        <Image style={myStyle.backImg}
               source={require('../../../images/back1.png')} />
        <ScrollView style={myStyle.contentView}
                    bounces={false}
                    showsVerticalScrollIndicator={false}>
          {{entries}}
        </ScrollView>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  backImg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 70,
    height: Dimensions.get('window').height,
    resizeMode: 'stretch',
  },
  contentView: {
    flex: 1,
    marginLeft: 60,
    marginRight: 20,
    marginTop: 20,
  },
});
