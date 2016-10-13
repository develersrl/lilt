'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { blocks } from '../style';
const { structureitem } = blocks;


export default class StructureItem extends Component {
  renderInfoValue(propName, index) {
    return (
      <Text key={index}>{this.props[propName]}</Text>
      );
  }


  renderInfo(infoPrefix, icon) {
    // Collect the available properties with specified prefix.
    // Example: if prefix is "phone" we search for "phone*" properties
    // and we collect them inside the "propsToBeRendered" array.
    const propsToBeRendered = [];
    for (const k of Object.keys(this.props))
      if (k.startsWith(infoPrefix) && this.props[k])
        propsToBeRendered.push(k);

    // Do not render anything if there are no valid props
    if (propsToBeRendered.length === 0)
      return null;

    console.log(this.props);

    return (
      <View style={myStyle.infoView}>
        <Image style={myStyle.infoIcon} source={icon} />
        <View style={myStyle.infoValuesView}>
          {propsToBeRendered.map(this.renderInfoValue.bind(this))}
        </View>
      </View>
      );
  }


  render() {
    const { style, title, subtitle } = this.props;

    return (
      <View style={[myStyle.container, style]}>
        <View style={myStyle.firstRow}>
          <Image style={myStyle.titleMarker}
                 source={require('../../images/marker-orange.png')}
                 />
          <View style={myStyle.titleView}>
            <Text style={myStyle.titleText}>{title}</Text>
            <Text style={myStyle.subtitleText}>{subtitle}</Text>
          </View>
        </View>
        <View style={myStyle.infosView}>
          {this.renderInfo('phone', require('../../images/phone.png'))}
          {this.renderInfo('openings', require('../../images/clock.png'))}
          {this.renderInfo('mail', require('../../images/mail.png'))}
          {this.renderInfo('web', require('../../images/website.png'))}
        </View>
      </View>
      );
  }
}


StructureItem.propTypes = {
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  title: React.PropTypes.string.isRequired,
  subtitle: React.PropTypes.string.isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
  },
  firstRow: {
    flexDirection: 'row',
    height: structureitem.titleRowHeight,
  },
  titleMarker: {
    width: structureitem.markerWidth,
    height: structureitem.titleRowHeight,
    resizeMode: 'contain',
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: structureitem.markerTitleGap,
    borderWidth: 1,
    borderColor: 'green',
  },
  titleText: {
    fontFamily: 'GillSans-Bold',
    fontSize: structureitem.titleFontSize,
  },
  subtitleText: {
    fontFamily: 'GillSans',
    fontSize: structureitem.subtitleFontSize,
  },
  infosView: {
    marginLeft: structureitem.markerWidth + structureitem.markerTitleGap,
    marginTop: structureitem.titleInfoGap,
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
  },
  infoIcon: {
    width: structureitem.iconSide,
    height: structureitem.iconSide,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: 'red',
  },
  infoValuesView: {
    borderWidth: 1,
    borderColor: 'green',
    flex: 1,
  },
});
