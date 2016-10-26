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
    const fields = stateApi.getRenderableUserAnswers();

    if (fields === null)
      return null;

    const skipMammografia = (data.screening !== 'NO');
    const rows = [];
    for (const k in fields) {
      if (k === 'mammografia' && skipMammografia)
        continue;
      rows.push(this.renderInfo(fields[k], data[k]));
    }

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
    const { navigator, getRoute } = this.props;
    stateApi.userForget().then(() => {
      navigator.popToTop();
      navigator.replace(getRoute('registration'));
    });
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


  renderQuestionnaireButton() {
    const { navigator, getRoute } = this.props;
    const openQuestionnaire = () => navigator.push(getRoute('__question0__'));

    if (stateApi.isQuestionnaireDone())
      return null;

    return (
      <TouchableOpacity style={myStyle.editView}
                        activeOpacity={profile.editBtnActiveOpacity}
                        onPress={openQuestionnaire}>
        <View style={myStyle.editBtn}>
          <Text style={myStyle.editText}>VAI AL QUESTIONARIO</Text>
        </View>
      </TouchableOpacity>
      );
  }


  render() {
    const data = stateApi.userData(true);
    const fields = stateApi.getRenderableUserFields();

    const standardDataRows = [];
    for (const k in fields)
      standardDataRows.push(this.renderInfo(fields[k], data[k]));

    let bmi;
    if (stateApi.isBMIAvailable()) {
      const bmiVal = parseFloat(stateApi.getUserBMI()).toFixed(2);
      const bmiLabel = stateApi.getUserBMILabel(stateApi.getUserBMIRange());
      bmi = this.renderInfo('IMC', `${bmiVal} (${bmiLabel})`);
    }

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
          {bmi}
          {this.renderQuestionnaireRows()}
          {this.renderEditButton()}
          {this.renderQuestionnaireButton()}
          {this.renderForgetButton()}
        </View>
      </ScrollView>
      );
  }
}


Profile.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
};


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
    marginBottom: 20,
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
