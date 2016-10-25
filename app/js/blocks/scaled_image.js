'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';


export default class ScaledImage extends Component {

  render() {
    const ratio = this.props.targetWidth / this.props.originalWidth;
    const scaledHeight = ratio * this.props.originalHeight;

    return (
      <Image source={this.props.source}
      style={{
        width: this.props.targetWidth,
        padding: 0,
        resizeMode: 'contain',
        height: scaledHeight
      }}/>
      );
  }
}

ScaledImage.propTypes = {
  source: React.PropTypes.number.isRequired,
  originalWidth: React.PropTypes.number.isRequired,
  originalHeight: React.PropTypes.number.isRequired,
  targetWidth: React.PropTypes.number.isRequired,
};