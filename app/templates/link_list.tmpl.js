'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';

import { LinkListItem } from '../../blocks';
import { common } from '../../style';


export default class LinkList extends Component {
  render() {
    const { navigator, getRoute } = this.props;
    const { flexible } = common;

    const loremIpsum = "Lorem Ipsum is simply dummy text of the printing";
    const title = "{{title}}";

    return (
      <View style={[flexible]}>
        <Image style={myStyle.backImg}
               source={require('../../../images/back1.png')} />
        <ScrollView style={myStyle.contentView}
                    bounces={false}
                    showsVerticalScrollIndicator={false}>
          <View style={myStyle.titleView}>
            <Text style={myStyle.titleText}>{title}</Text>
          </View>
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
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleText: {
    color: '#FF9C8D',
    fontFamily: 'GillSans-Bold',
    fontSize: 13,
  },
});
