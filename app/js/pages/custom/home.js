'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import Mixpanel from 'react-native-mixpanel';

import { api as stateApi } from '../../state';
import { SquareMenu } from '../../blocks';
import { pages } from '../../style';
const { home } = pages;


export default class Home extends Component {
  componentWillMount() {
    // const { navigator, getRoute } = this.props;
    stateApi.init();
    // setTimeout(() => stateApi.setSelectedTab('structures'), 500);
    // setTimeout(() => navigator.push(getRoute('glossary')), 500);
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


  onSquareMenuPress(position) {
    const { navigator, getRoute } = this.props;
    const routes = [
      '#ll_menu_saperne',
      '#ll_menu_prevenzione',
      '#ll_menu_diagnosi',
      'glossary',
    ];

    const selectedRoute = routes[position];

    const routeToMixpanelEvent = {
      '#ll_menu_saperne': 'Saperne Di Piu',
      '#ll_menu_prevenzione': 'Prevenzione',
      '#ll_menu_diagnosi': 'Diagnosi Precoce',
      glossary: 'Wiki LILT',
    };

    Mixpanel.track(routeToMixpanelEvent[selectedRoute]);
    navigator.push(getRoute(selectedRoute));
  }


  onCustomMenuPress(index) {
    const { navigator, getRoute } = this.props;

    const mixpanelEvent = [
      'Mio percorso di prevenzione',
      'Ho sentito qualcosa',
      'Richiamata',
      'Sono stata operata',
    ];

    Mixpanel.track(mixpanelEvent[index]);

    if (index === 0 && !stateApi.userExists()) {
      stateApi.setSelectedTab('profile');
    }
    else {
      if (index === 0) {
        // Since the user is registered we open custom prevention page
        navigator.push(getRoute('customPrevention'));
      }
      else if (index === 1) {
        navigator.push(getRoute('#c_gen_2'));
      }
      else if (index === 2) {
        navigator.push(getRoute('#c_gen_1'));
      }
      else {
        navigator.push(getRoute('#c_gen_3'));
      }
    }
  }


  renderCustomMenu(idx, text) {
    const iconKey = 'customMenu' + (idx + 1) + 'Icon';
    const icon = home[iconKey];

    return (
      <TouchableOpacity key={idx}
                        style={myStyle.customMenuView}
                        onPress={() => this.onCustomMenuPress.bind(this)(idx)}
                        >
        <Image style={myStyle.customCircle}
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
      'Ho sentito qualcosa di diverso',
      'Richiamata dopo la mammografia',
      'Sono stata operata',
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


  render() {
    return (
      <ScrollView style={myStyle.scrollView}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  centerContent={true}
                  >
        <View style={myStyle.container}>
          <View style={myStyle.logoView}>
            <Image style={myStyle.logoImage} source={home.logoImage} />
            <View style={myStyle.logoParagraphView}>
              <Text style={myStyle.logoParagraph}>
                Parliamo di tumore al seno e prevenzione: informazioni per
                tutti e informazioni personalizzate, proprio per te!
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
        </View>
      </ScrollView>
      );
  }
}


Home.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
};


const myStyle = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    // paddingBottom: 20,
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
