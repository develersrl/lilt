'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { LinkListItem } from '../../blocks';
import { common } from '../../style';


export default class LinkList extends Component {
  render() {
    const { navigator, getRoute } = this.props;
    const { flexible } = common;

    return (
      <View style={[flexible]}>
        <Image style={myStyle.backImg}
               source={require('../../../images/back1.png')} />
        <LinkListItem title={'Informazioni'}
                      caption={'Capitolo 1 / 2'}
                      onLinkPress={() => navigator.push(getRoute('#9'))} />
        <LinkListItem title={'Cause e Fattori'}
                      caption={'Capitolo 1 / 2'}
                      onLinkPress={() => navigator.push(getRoute('#9'))} />
        <LinkListItem title={'Terapia'}
                      caption={'Capitolo 1 / 2'}
                      onLinkPress={() => navigator.push(getRoute('#9'))} />
        <LinkListItem title={'Dopo la terapia'}
                      caption={'Capitolo 1 / 2'}
                      onLinkPress={() => navigator.push(getRoute('#9'))} />
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
});

