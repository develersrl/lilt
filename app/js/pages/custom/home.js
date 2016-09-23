'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { api as stateApi } from '../../state';
import { pages } from '../../style';


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
            <View style={myStyle.menuCell}>
            </View>
            <View style={myStyle.menuCell}>
            </View>
          </View>
          <View style={myStyle.menuRow}>
            <View style={myStyle.menuCell}>
            </View>
            <View style={myStyle.menuCell}>
            </View>
          </View>
        </View>
        <View style={myStyle.belowMenuView}>
          {labels.map((l) => this.renderFakeLink(l))}
        </View>
      </View>
      );
  }
}


const { home } = pages;
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
  menuCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'blue',
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
