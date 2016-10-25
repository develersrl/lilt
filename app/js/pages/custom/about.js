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


export default class About extends Component {

  constructor(props) {
    super(props);
    this.renderPhone = this.renderPhone.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.renderUrl = this.renderUrl.bind(this);
  }

  renderPhone(number, mystyle) {
    let telLink = 'tel:' + number;
    telLink = telLink.split(' ').join('');

    return (
      <Text onPress={() => openURL(telLink)} style={mystyle}>
        {number}
      </Text>
      );
  }

  renderEmail(email, mystyle) {
    return (
      <Text onPress={() => openURL('mailto:' + email)} style={mystyle}>
        {email}
      </Text>
      );
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

    const title = "ABOUT LILT";

    /* eslint-disable max-len */
    const par1Title = "Chi siamo";
    const par1Text1 = "La Lega Italiana per la Lotta contro i Tumori è un Ente Pubblico sotto l'alto Patronato del Presidente della Repubblica. Da 90 anni la LILT opera in ambito oncologico in tutta Italia svolgendo attività di prevenzione, diagnosi precoce, assistenza, riabilitazione, educazione sanitaria e ricerca.";
    const par1Text2 = "La LILT- Sezione di Firenze ONLUS è presente sul territorio fiorentino con attività di prevenzione ed educazione alla salute (interventi nelle Scuole, campagne di sensibilizzazione, Gruppi per smettere di fumare), diagnosi precoce (ambulatorio di prevenzione melanoma), assistenza domiciliare (“Centro di aiuto al malato oncologico”, che collabora con il Servizio Pubblico, finanzia personale medico e fornisce ausili sanitari utili per facilitare e migliorare la qualità di vita del paziente in fase avanzata di malattia) e rieducazione psico-sociale (“Donna Come Prima”, che offre un aiuto concreto a tutte le donne operate al seno per tumore. Dal 2005 il Servizio ha sede presso il Centro di Riabilitazione Oncologica a Villa delle Rose, dove la LILT collabora con l’Istituto per lo Studio e la Prevenzione Oncologica).";

    const par2Title = "Sostieni la LILT";
    const par2Text1 = "È grazie alla generosità di soci e donatori se la LILT da 90 anni è in prima linea nella lotta alla malattia oncologica.";
    const par2Text2 = "Per aiutarci:\nConto corrente postale\nnumero 12911509\n\nConto corrente bancario\nnumero 05000/1000/00075424\nBanca Prossima IBAN: IT95C0335901600100000075424\n\nDona il tuo 5x1000\nCodice Fiscale LILT Firenze 94051880485";
    /* eslint-enable max-len */

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
            <ScaledImage
              source={require('../../../images/lilt-logo.png')}
              targetWidth={Dimensions.get('window').width - 70}
              originalWidth={1002}
              originalHeight={506}/>

            <View style={[myStyle.paragraphContainer]}>
              <Text style={myStyle.paragraphTitle}>{par1Title}</Text>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par1Text1}
              </Text>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par1Text2}
              </Text>
            </View>
            <View style={[myStyle.paragraphContainer]}>
              <Text style={myStyle.paragraphTitle}>{par2Title}</Text>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par2Text1}
              </Text>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                {par2Text2}
              </Text>
            </View>
            <View style={[myStyle.paragraphContainer]}>
              <Text style={myStyle.paragraphTitle}>Contatti</Text>
              <Text style={[myStyle.verticalSpacer, myStyle.paragraphText]}>
                Tel. {this.renderPhone(
                  '055 576939',
                  myStyle.infoLink)}   Fax 055 580152
              </Text>
              <Text style={myStyle.paragraphText}>
                Viale D. Giannotti, 23 – 50126 Firenze
              </Text>
              <Text style={myStyle.paragraphText}>
                {this.renderEmail(
                  'info@legatumorifirenze.it',
                  myStyle.infoLink)}
              </Text>
              <Text style={myStyle.paragraphText}>
                {this.renderUrl(
                  'www.legatumorifirenze.it',
                  myStyle.infoLink)}
              </Text>
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
  paragraphTitle: {
    fontFamily: 'GillSans',
    fontSize: 16,
  },
  paragraphContainer: {
    padding: 10,
  },
  verticalSpacer: {
    marginTop: 10,
  },
  infoLink: {
    color: '#74B3FA',
  },
  paragraphText: {
    fontFamily: 'GillSans',
    fontSize: 16,
    color: '#8E8E8E',
    lineHeight: 20,
  },
});
