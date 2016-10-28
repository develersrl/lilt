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
    this.props.navigator.popToTop();
  }


  render() {
    const { text, title } = this.props;

    return (
      <View style={myStyle.container}>
        <Text style={myStyle.titleText}>{title}</Text>
        <Text style={myStyle.text}>{text}</Text>
        <Image style={myStyle.image}
          source={require('../../../images/thanks.png')}
        />
        <View style={myStyle.btn}>
          <Button2 text={'VAI AL TUO PROFILO'}
                   onPress={this.onButtonPress.bind(this)} />
        </View>
      </View>
      );
  }
}


MessagePage.propTypes = {
  text: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired,
  getRoute: React.PropTypes.func.isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
  },
  titleText: {
    color: '#74B3FA',
    fontFamily: 'GillSans-Bold',
    fontSize: 22,
  },
  backImg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 70,
    height: Dimensions.get('window').height,
    resizeMode: 'stretch',
  },
  text: {
    color: '#8E8E8E',
    fontFamily: 'GillSans',
    lineHeight: 20,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 50,
  },
  btn: {
    width: 240,
    marginTop: 50,
  },
});
