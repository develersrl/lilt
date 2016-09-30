'use strict';

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { api as stateApi } from '../../state';
import { pages } from '../../style';
const { profile } = pages;



export default class Profile extends Component {
  renderInfo(label, value) {
    return (
      <View key={label} style={myStyle.infoView}>
        <View>
          <Text style={myStyle.labelText}>{label}</Text>
        </View>
        <View style={{flex: 1}} />
        <View>
          <Text style={myStyle.valueText}>{value}</Text>
        </View>
      </View>
      );
  }


  renderQuestionnaireRows() {
    const data = stateApi.userData(false);

    if (data === null)
      return null;

    const rows = [];
    for (const k in data)
      rows.push(this.renderInfo(k, data[k]));

    return (
      <View style={myStyle.questionnaireView}>
        <Text style={myStyle.explanation}>
          Le tue risposte al questionario:
        </Text>
        {rows}
      </View>
      );
  }


  onEditPress() {
    const { navigator, getRoute } = this.props;
    navigator.push(getRoute('editProfile'));
  }


  onForgetPress() {
    const { navigator } = this.props;
    stateApi.userForget().then(navigator.popToTop);
  }


  renderEditButton() {
    return (
      <TouchableOpacity style={myStyle.editView}
                        activeOpacity={profile.editBtnActiveOpacity}
                        onPress={this.onEditPress.bind(this)}>
        <View style={myStyle.editBtn}>
          <Text style={myStyle.editText}>MODIFICA PROFILO</Text>
        </View>
      </TouchableOpacity>
      );
  }


  renderForgetButton() {
    return (
      <TouchableOpacity style={myStyle.editView}
                        activeOpacity={profile.editBtnActiveOpacity}
                        onPress={this.onForgetPress.bind(this)}>
        <View style={myStyle.editBtn}>
          <Text style={myStyle.editText}>DIMENTICA UTENTE (TEST ONLY)</Text>
        </View>
      </TouchableOpacity>
      );
  }


  render() {
    const data = stateApi.userData(true);

    const labelMappings = {
      email: 'Email',
      name: 'Nome',
      surname: 'Cognome',
      address: 'Indirizzo',
      age: 'Età',
      cap: 'CAP',
    };

    const standardDataRows = [];
    for (const k in data)
      standardDataRows.push(this.renderInfo(labelMappings[k], data[k]));

    return (
      <ScrollView style={myStyle.container}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustContentInsets={false}
                  >
        <Image style={myStyle.icon}
               source={require('../../../images/profile-icon.png')}
               />
        <View>
          <Text style={myStyle.explanation}>I tuoi dati:</Text>
          {standardDataRows}
          {this.renderQuestionnaireRows()}
          {this.renderEditButton()}
          {this.renderForgetButton()}
        </View>
      </ScrollView>
      );
  }
}



const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: profile.bodyPadding,
  },
  icon: {
    width: profile.iconWidth,
    height: profile.iconHeight,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  infoView: {
    flexDirection: 'row',
    paddingTop: profile.infoPaddingTopBottom,
    paddingBottom: profile.infoPaddingTopBottom,
    paddingLeft: profile.infoPaddingLeftRight,
    paddingRight: profile.infoPaddingLeftRight,
    backgroundColor: profile.infoBackground,
    marginBottom: profile.infoSpacing,
  },
  labelText: {
    color: profile.textColor,
    fontFamily: 'GillSans',
    fontSize: profile.labelsFontSize,
  },
  valueText: {
    color: profile.textColor,
    fontFamily: 'GillSans-Bold',
    fontSize: profile.valuesFontSize,
  },
  questionnaireView: {
    marginTop: 20,
  },
  explanation: {
    color: profile.explanationColor,
    fontFamily: 'GillSans',
    fontSize: profile.explanationFontSize,
    marginBottom: 10,
  },
  editView: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
  },
  editBtn: {
    padding: 16,
    backgroundColor: profile.editBtnBackground,
  },
  editText: {
    color: profile.textColor,
    fontFamily: 'GillSans',
    fontSize: profile.editBtnFontSize,
  },
});
