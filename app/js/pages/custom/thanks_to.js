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

import { openURL } from '../../misc';
import { common } from '../../style';
import ScaledImage from '../../blocks/scaled_image';

const extractUrl = (text) => {
  const tokens = text.match(/(.*?\()(.*?)(\).*)/);
  return [tokens[1].trim(), tokens[2], tokens[3].trim()];
};


export default class ThanksTo extends Component {

  constructor(props) {
    super(props);
    this.renderUrl = this.renderUrl.bind(this);
  }

  renderUrl(url, mystyle) {
    let u = url;
    if (!u.startsWith('http://')) {
      u = 'http://' + url;
    }

    return (
      <Text onPress={() => openURL(u)} style={mystyle}>
        {url}
      </Text>
      );
  }

  render() {
    const { flexible } = common;

    /* eslint-disable max-len */
    const title = "GRAZIE A";
    const introText = "La LILT Firenze ringrazia tutti coloro che hanno contribuito a rendere possibile la realizzazione della APP:";
    const par1Title = 'Gli Enti partner';
    const par1Bullet1 = 'ISPO – Istituto per lo Studio e la Prevenzione Oncologica (www.ispo.toscana.it)';
    const par1Bullet2 = 'Azienda Unità Sanitaria Locale Toscana Centro (www.asf.toscana.it)';
    const par1Bullet3 = 'Azienda Ospedaliero Universitaria Careggi (www.aou-careggi.toscana.it)';

    const par2Title = 'I professionisti che hanno collaborato';
    const par2Bullet1 = 'Eugenio Paci (Responsabile Scientifico Progetto, LILT Firenze)';
    const par2Bullet2 = 'Catia Angiolini (AOU Careggi)';
    const par2Bullet3 = 'Elisabetta Bernardini (LILT Firenze)';
    const par2Bullet4 = 'Carolina Degl’Innocenti (Assistente sanitaria)';
    const par2Bullet5 = 'Alessandro Filomena (AUSL Toscana Centro)';
    const par2Bullet6 = 'Giovanna Franchi (LILT Firenze)';
    const par2Bullet7 = 'Anna Iossa (ISPO)';
    const par2Bullet8 = 'Paola Mantellini (ISPO)';
    const par2Bullet9 = 'Simonetta Salvini (Dietista nutrizionista)';
    const par2Bullet10 = 'Anna Bonciani (Grafica)';

    const par3Title = 'La Ditta che ha sviluppato la APP';
    const par3Bullet1 = 'Develer (www.develer.com)';

    const par4Text = `Un particolare ringraziamento all’Associazione Corri la Vita che ha finanziato la APP. Corri la Vita è un progetto nato nel 2003 per contribuire a potenziare i servizi sanitari dell’Area Fiorentina nella lotta contro il tumore al seno e l’assistenza ai malati oncologici. Tutti i fondi raccolti dall’Associazione Corri la Vita vengono interamente erogati per questi obiettivi grazie al contributo del volontariato fiorentino.`;
    /* eslint-enable max-len */

    const bulletItem = (text) => {
      return (
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <Text style={{marginLeft: 10, marginRight: 10}}>{"\u2022"}</Text>
          <View style={{flex: 1}}>
            <Text style={myStyle.paragraphText}>
              {text}
            </Text>
          </View>
        </View>
        );
    };

    const bulletItemWithUrl = (text) => {
      const tokens = extractUrl(text);
      let u = tokens[1];
      if (!u.startsWith('http://')) {
        u = 'http://' + tokens[1];
      }

      return (
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <Text style={{marginLeft: 10, marginRight: 10}}>{"\u2022"}</Text>
          <View style={{flex: 1}}>
            <Text>
              <Text style={myStyle.paragraphText}>
                {tokens[0]}
              </Text>
              <Text onPress={() => openURL(u)}
                style={[myStyle.paragraphText, myStyle.infoLink]}>
                {tokens[1]}
              </Text>
              <Text style={myStyle.paragraphText}>
                {tokens[2]}
              </Text>
            </Text>
          </View>
        </View>
        );
    };


    return (
      <View style={myStyle.container}>
        <Image style={myStyle.backImg}
               source={require('../../../images/back1.png')} />
        <ScrollView style={[flexible]}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    >
          <View style={myStyle.contentView}>
            <View style={myStyle.titleView}>
              <Text style={myStyle.titleText}>{title}</Text>
            </View>
            <View style={[myStyle.paragraphContainer]}>
              <Text style={myStyle.paragraphText}>{introText}</Text>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par1Title}
              </Text>
              {bulletItemWithUrl(par1Bullet1)}
              {bulletItemWithUrl(par1Bullet2)}
              {bulletItemWithUrl(par1Bullet3)}
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par2Title}
              </Text>
              {bulletItem(par2Bullet1)}
              {bulletItem(par2Bullet2)}
              {bulletItem(par2Bullet3)}
              {bulletItem(par2Bullet4)}
              {bulletItem(par2Bullet5)}
              {bulletItem(par2Bullet6)}
              {bulletItem(par2Bullet7)}
              {bulletItem(par2Bullet8)}
              {bulletItem(par2Bullet9)}
              {bulletItem(par2Bullet10)}
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par3Title}
              </Text>
              {bulletItemWithUrl(par3Bullet1)}
            </View>
            <View style={[myStyle.paragraphContainer]}>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par4Text}
              </Text>
              <View style={myStyle.centered}>
                <ScaledImage
                  source={require('../../../images/corri-la-vita.png')}
                  targetWidth={Dimensions.get('window').width - 100}
                  originalWidth={1000}
                  originalHeight={481}/>
                <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                  {this.renderUrl('www.corrilavita.it', myStyle.infoLink)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
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
    marginTop: common.statusBarHeight,
    padding: 20,
  },
  titleText: {
    color: '#FF9C8D',
    fontFamily: 'GillSans-Bold',
    fontSize: 13,
  },
  verticalSpacer: {
    marginTop: 10,
  },
  paragraphContainer: {
    padding: 10,
  },
  centered: {
    alignItems: 'center',
  },
  paragraphText: {
    fontFamily: 'GillSans',
    fontSize: 16,
    color: '#8E8E8E',
    lineHeight: 20,
  },
  infoLink: {
    color: '#74B3FA',
  },
});
