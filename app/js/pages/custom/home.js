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


  onProfilePress() {
    const { navigator, getRoute } = this.props;
    const targetRoute = stateApi.userExists() ? 'profile' : 'registration';
    navigator.push(getRoute(targetRoute));
  }


  renderProfileLink() {
    return (
      <TouchableOpacity onPress={this.onProfilePress.bind(this)}>
        <Text style={myStyle.fakeLink}>Profilo</Text>
      </TouchableOpacity>
      );
  }


  onSquareMenuPress(position) {
    const { navigator, getRoute } = this.props;
    const routes = [
      '#ll_menu_saperne',
      '#ll_menu_prevenzione',
      '#ll_menu_diagnosi',
      'glossary',
    ];

    navigator.push(getRoute(routes[position]));
  }


  render() {
    const labels = [
      'Il mio percorso di prevenzione',
      'Ho avuto una diagnosi positiva',
      'Ho sentito qualcosa che non va',
      'Sono in post terapia',
    ];

    const icon = require('../../../images/transparent.png');

    return (
      <View style={myStyle.container}>
        <View style={myStyle.logoView}>
          <Text>LOGO + PARAGRAFO</Text>
        </View>
        <View style={myStyle.menuView}>
          <View style={myStyle.menuRow}>
            <SquareMenu backgroundColor={home.menuTopLeft.background}
                        text={'Saperne di più'}
                        iconSource={icon}
                        onPress={() => this.onSquareMenuPress(0)} />
            <SquareMenu backgroundColor={home.menuTopRight.background}
                        text={'Prevenzione'}
                        iconSource={icon}
                        onPress={() => this.onSquareMenuPress(1)} />
          </View>
          <View style={myStyle.menuRow}>
            <SquareMenu backgroundColor={home.menuBottomLeft.background}
                        text={'Diagnosi precoce'}
                        iconSource={icon}
                        onPress={() => this.onSquareMenuPress(2)} />
            <SquareMenu backgroundColor={home.menuBottomRight.background}
                        text={'WikiLILT'}
                        iconSource={icon}
                        onPress={() => this.onSquareMenuPress(3)} />
          </View>
        </View>
        <View style={myStyle.belowMenuView}>
          {labels.map((l) => this.renderFakeLink(l))}
          <View style={{height: 20}} />
          {this.renderProfileLink()}
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
