'use strict';

import React, { Component } from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { blocks } from '../style';
const { squareMenu } = blocks;


export default class SquareMenu extends Component {
  constructor(props) {
    super(props);

    // Compute custom stylesheet
    const { backgroundColor } = this.props;
    this.state = {
      myStyle: styleCreator(backgroundColor),
    };
  }

  render() {
    const { myStyle } = this.state;
    const { text, iconSource, onPress } = this.props;

    return (
      <TouchableOpacity style={myStyle.container}
                        activeOpacity={squareMenu.pressedOpacity}
                        onPress={onPress}>
        <Image style={myStyle.image}
               source={iconSource} />
        <Text style={myStyle.text}>{text}</Text>
      </TouchableOpacity>
      );
  }
}


SquareMenu.propTypes = {
  backgroundColor: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  iconSource: React.PropTypes.number.isRequired,
  onPress: React.PropTypes.func.isRequired,
};


const styleCreator = (backgroundColor) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
  },
  image: {
    width: squareMenu.side,
    height: squareMenu.side,
    resizeMode: 'contain',
    marginBottom: squareMenu.textGap,
  },
  text: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    fontSize: 14,
  },
});
