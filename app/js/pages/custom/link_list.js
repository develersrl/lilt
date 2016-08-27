'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { LinkListItem } from '../../blocks';
import { common } from '../../style';


export default class LinkList extends Component {
  render() {
    const { navigator, getRoute } = this.props;
    const { flexible } = common;

    return (
      <View style={[flexible]}>
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
