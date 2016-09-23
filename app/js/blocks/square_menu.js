'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


export default class SquareMenu extends Component {
  constructor(props) {
    super(props);

    // Compute custom stylesheet
    const { backgroundColor, circleSide } = this.props;
    this.state = {
      myStyle: styleCreator(backgroundColor, circleSide),
    };
  }

  render() {
    const { myStyle } = this.state;
    const { text } = this.props;

    return (
      <View style={myStyle.container}>
        <Image style={myStyle.image}
               source={require('../../images/transparent.png')} />
        <Text style={myStyle.text}>{text}</Text>
      </View>
      );
  }
}


SquareMenu.propTypes = {
  backgroundColor: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  circleSide: React.PropTypes.number.isRequired,
};


const styleCreator = (backgroundColor, circleSide) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
  },
  image: {
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: circleSide / 2,
    width: circleSide,
    height: circleSide,
    resizeMode: 'contain',
    marginBottom: 7,
  },
  text: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    fontSize: 14,
  },
});
