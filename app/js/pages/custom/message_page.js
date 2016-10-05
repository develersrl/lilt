'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
} from 'react-native';

import { Button2 } from '../../blocks';


export default class MessagePage extends Component {
  onButtonPress() {
    const { navigator, getRoute } = this.props;
    navigator.popToTop();
    navigator.replace(getRoute('profile'));
  }


  render() {
    const { text } = this.props;

    return (
      <View style={myStyle.container}>
        <Image style={myStyle.backImg}
               source={require('../../../images/back1.png')} />
        <View style={myStyle.contentView}>
          <View style={myStyle.textView}>
            <Text style={myStyle.text}>{text}</Text>
          </View>
          <View style={myStyle.btn}>
            <Button2 text={'VAI AL TUO PROFILO'}
                     onPress={this.onButtonPress.bind(this)} />
          </View>
        </View>
        <View style={myStyle.spacer} />
      </View>
      );
  }
}


MessagePage.propTypes = {
  text: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#8E8E8E',
    fontFamily: 'GillSans',
    lineHeight: 20,
    fontSize: 15,
    textAlign: 'center',
  },
  btn: {
    width: 200,
    marginTop: 20,
  },
  spacer: {
    height: 200,
  },
});
