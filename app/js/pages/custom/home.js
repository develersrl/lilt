'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { api as stateApi } from '../../state';
import { SquareMenu } from '../../blocks';
import { pages } from '../../style';

const { home } = pages;


export default class Home extends Component {
  componentWillMount() {
    stateApi.init();
  }

  renderFakeLink(txt) {
    const { navigator, getRoute } = this.props;

    return (
      <TouchableOpacity key={txt}
                        onPress={() => navigator.push(getRoute('#c_gen_1'))}>
        <Text style={myStyle.fakeLink}>{txt}</Text>
      </TouchableOpacity>
      );
  }

  render() {
    const labels = [
      'Il mio percorso di prevenzione',
      'Ho avuto una diagnosi positiva',
      'Ho sentito qualcosa che non va',
      'Sono in post terapia',
    ];

    return (
      <View style={myStyle.container}>
        <View style={myStyle.logoView}>
          <Text>LOGO + PARAGRAFO</Text>
        </View>
        <View style={myStyle.menuView}>
          <View style={myStyle.menuRow}>
            <SquareMenu backgroundColor={home.menuTopLeft.background}
                        text={'Saperne di più'}
                        circleSide={home.circlesSide} />
            <SquareMenu backgroundColor={home.menuTopRight.background}
                        text={'Prevenzione'}
                        circleSide={home.circlesSide} />
          </View>
          <View style={myStyle.menuRow}>
            <SquareMenu backgroundColor={home.menuBottomLeft.background}
                        text={'Diagnosi precoce'}
                        circleSide={home.circlesSide} />
            <SquareMenu backgroundColor={home.menuBottomRight.background}
                        text={'WikiLILT'}
                        circleSide={home.circlesSide} />
          </View>
        </View>
        <View style={myStyle.belowMenuView}>
          {labels.map((l) => this.renderFakeLink(l))}
        </View>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoView: {
    height: home.aboveMenuHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuView: {
    height: home.menuHeight,
  },
  menuRow: {
    flex: 1,
    flexDirection: 'row',
  },
  belowMenuView: {
    height: home.belowMenuHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
