'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

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


  onCustomMenuPress(index) {
    const { navigator, getRoute } = this.props;

    if (!stateApi.userExists()) {
      navigator.push(getRoute('registration'));
    }
    else {
      // TODO: open the right page based on index and user data
      navigator.push(getRoute('#c_gen_1'));
    }
  }


  renderCustomMenu(idx, text) {
    const colorKey = 'customMenu' + (idx + 1) + 'Background';
    const iconKey = 'customMenu' + (idx + 1) + 'Icon';
    const color = home[colorKey];
    const icon = home[iconKey];

    return (
      <TouchableOpacity key={idx}
                        style={myStyle.customMenuView}
                        onPress={() => this.onCustomMenuPress.bind(this)(idx)}
                        >
        <Image style={[myStyle.customCircle, {borderColor: color}]}
               source={icon}
               />
        <View style={myStyle.customMenuTextView}>
          <Text style={myStyle.customMenuText}>{text}</Text>
        </View>
      </TouchableOpacity>
      );
  }


  renderCustomServices() {
    const labels = [
      'Il mio percorso di prevenzione',
      'Ho avuto una diagnosi positiva',
      'Ho sentito qualcosa che non va',
      'Sono in post terapia',
    ];

    return (
      <View>
        <Text style={myStyle.customServicesText}>
          Servizi Personalizzati
        </Text>
        <View style={myStyle.customServicesView}>
          {labels.map((text, i) => this.renderCustomMenu(i, text))}
        </View>
      </View>
      );
  }


  renderTestLinks() {
    const labels = [
      'Il mio percorso di prevenzione',
      'Ho avuto una diagnosi positiva',
      'Ho sentito qualcosa che non va',
      'Sono in post terapia',
    ];

    return (
      <View style={myStyle.belowMenuView}>
        {labels.map((l) => this.renderFakeLink(l))}
        <View style={{height: 20}} />
        {this.renderProfileLink()}
      </View>
      );
  }


  render() {
    return (
      <View style={myStyle.container}>
        <View style={myStyle.logoView}>
          <Image style={myStyle.logoImage} source={home.logoImage} />
          <View style={myStyle.logoParagraphView}>
            <Text style={myStyle.logoParagraph}>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s.
            </Text>
          </View>
        </View>
        <View style={myStyle.menuView}>
          <View style={myStyle.menuRow}>
            <SquareMenu backgroundColor={home.menuTopLeftBackground}
                        text={'Saperne di più'}
                        iconSource={home.menuTopLeftIcon}
                        onPress={() => this.onSquareMenuPress(0)} />
            <SquareMenu backgroundColor={home.menuTopRightBackground}
                        text={'Prevenzione'}
                        iconSource={home.menuTopRightIcon}
                        onPress={() => this.onSquareMenuPress(1)} />
          </View>
          <View style={myStyle.menuRow}>
            <SquareMenu backgroundColor={home.menuBottomLeftBackground}
                        text={'Diagnosi precoce'}
                        iconSource={home.menuBottomLeftIcon}
                        onPress={() => this.onSquareMenuPress(2)} />
            <SquareMenu backgroundColor={home.menuBottomRightBackground}
                        text={'WikiLILT'}
                        iconSource={home.menuBottomRightIcon}
                        onPress={() => this.onSquareMenuPress(3)} />
          </View>
        </View>
        {this.renderCustomServices()}
        {
          // this.renderTestLinks()
        }
      </View>
      );
  }
}


Home.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    resizeMode: 'contain',
    height: home.logoImageHeight,
  },
  logoParagraphView: {
    alignSelf: 'stretch',
    marginTop: 15,
    marginLeft: home.logoParagraphMargins,
    marginRight: home.logoParagraphMargins,
    marginBottom: 25,
  },
  logoParagraph: {
    textAlign: 'center',
    color: '#8E8E8E',
    fontFamily: 'GillSans',
    fontSize: home.logoParagraphFontSize,
    lineHeight: home.logoParagraphLineHeight,
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
  customServicesText: {
    textAlign: 'center',
    padding: 20,
    color: '#74B3FA',
    fontFamily: 'GillSans-Bold',
    fontSize: 14,
  },
  customServicesView: {
    flexDirection: 'row',
    paddingLeft: home.customMenuLeftRightMargins,
    paddingRight: home.customMenuLeftRightMargins,
  },
  customMenuView: {
    flex: 1,
    alignItems: 'center',
  },
  customCircle: {
    width: home.customMenuCircleWidth,
    height: home.customMenuCircleWidth,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: home.customMenuCircleWidth / 2,
    marginBottom: home.customMenuIconTextGap,
  },
  customMenuTextView: {
    paddingLeft: home.customMenuTextMargins,
    paddingRight: home.customMenuTextMargins,
  },
  customMenuText: {
    textAlign: 'center',
    fontFamily: 'GillSans',
    fontSize: home.customMenuTextFontSize,
    color: '#8E8E8E',
  },
});
