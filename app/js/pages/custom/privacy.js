'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Text,
} from 'react-native';

import { common } from '../../style';


export default class Privacy extends Component {
  render() {
    const { flexible } = common;

    /* eslint-disable max-len */
    const text = "Preso atto dell’informativa di cui all’art. 13 del decreto legislativo 30 giugno 2003, n. 196, il Sottoscritto autorizza il trattamento e la comunicazione a LILT- Sezione di Firenze ONLUS (e a enti e/o consulenti che collaborano con LILT- Sezione di Firenze ONLUS, sempre nel rispetto delle finalità di detto Ente), autorizzando anche l’invio di materiale informativo e di altre informazioni relative alla prevenzione dei tumori. Autorizza inoltre l’uso dei dati per elaborazioni statistiche relative all’utilizzo della APP “LILT-FI seno”. Titolare del trattamento dei dati è LILT Lega Italiana per la Lotta contro i Tumori sezione di Firenze, Via D. Giannotti 23, 50126 Firenze";
    const title = "INFORMATIVA SULLA PRIVACY";
    /* eslint-enable max-len */

    return (
      <ScrollView style={[flexible]}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  >
        <View style={myStyle.container}>
          <Image style={myStyle.backImg}
                 source={require('../../../images/back1.png')} />
          <View style={myStyle.contentView}>
            <View style={myStyle.titleView}>
              <Text style={myStyle.titleText}>{title}</Text>
            </View>
            <View style={[myStyle.paragraphContainer]}>
              <Text style={myStyle.paragraphText}>
                {text}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
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
    justifyContent: 'center',
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
  paragraphContainer: {
    padding: 10,
  },
  paragraphText: {
    fontFamily: 'GillSans',
    fontSize: 16,
    color: '#8E8E8E',
    lineHeight: 20,
  },
});
