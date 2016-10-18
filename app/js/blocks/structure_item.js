'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { openURL } from '../misc';


import { blocks } from '../style';
const { structureitem } = blocks;


export default class StructureItem extends Component {
  renderInfoValue(propName, index) {
    // There are a bunch of fields that must be ignored because they are
    // accessory to other fields
    const toBeIgnored = ['addressMap', 'web1Link', 'web2Link'];
    for (let i = 0; i < toBeIgnored.length; ++i)
      if (propName === toBeIgnored[i])
        return null;

    // Determine info value type (simple text, link or email)
    let valueType = 'text';
    if (propName.startsWith('web'))
      valueType = 'link';
    else if (propName.startsWith('mail'))
      valueType = 'mail';
    else if (propName.startsWith('address'))
      valueType = 'address';
    else if (propName.startsWith('phone'))
      valueType = 'phone';

    // Compute text style based on info type
    const valueStyle = [myStyle.infoValueText];
    if (valueType === 'link' || valueType === 'mail' || valueType === 'phone')
      valueStyle.push(myStyle.infoLink);

    const textBlock = (
      <Text style={valueStyle} key={index}>
        {this.props[propName]}
      </Text>
      );

    // If this is a simple text info we return the text block
    if (valueType === 'text')
      return textBlock;

    // Manage links and email addresses
    if (valueType === 'link' || valueType === 'mail') {
      let cb = null;
      if (valueType === 'link') {
        let linkURL = '';
        const urlProp = propName + 'Link';
        if (this.props.hasOwnProperty(urlProp))
          linkURL = this.props[urlProp];
        else
          linkURL = this.props[propName];

        cb = (() => openURL(linkURL));
      }
      else {
        // email address
        cb = (() => openURL('mailto:' + this.props[propName]));
      }

      return (
        <TouchableOpacity key={index} onPress={cb}>
          {textBlock}
        </TouchableOpacity>
        );
    }

    if (valueType === 'address') {
      const addressMap = propName + 'Map';

      let addressLink = '';
      if (this.props.hasOwnProperty(addressMap))
        addressLink = this.props[addressMap];
      else
        addressLink = this.props[propName];
      addressLink = addressLink.toLowerCase().split(' ').join('+');

      let linkPrefix = '';
      if (Platform.OS === 'ios')
        linkPrefix = 'http://maps.apple.com/?q=';
      else
        linkPrefix = 'http://maps.google.com/?q=';
      const mapLink = linkPrefix + addressLink;

      return (
        <View key={index}>
          {textBlock}
          <TouchableOpacity onPress={() => openURL(mapLink)}>
            <Text style={[myStyle.infoValueText, myStyle.infoLink]}>
              vedi su mappa
            </Text>
          </TouchableOpacity>
        </View>
        );
    }

    if (valueType === 'phone') {
      let telLink = 'tel:' + this.props[propName];
      telLink = telLink.split(' ').join('');

      return (
        <TouchableOpacity key={index} onPress={() => openURL(telLink)}>
          {textBlock}
        </TouchableOpacity>
        );
    }

    return textBlock;
  }


  renderInfo(info, idx) {
    const infoViewStyle = [myStyle.infoView];
    if (idx > 0)
      infoViewStyle.push(myStyle.infoSpacing);

    return (
      <View style={infoViewStyle} key={idx}>
        <Image style={myStyle.infoIcon} source={info.icon} />
        <View style={myStyle.infoValuesView}>
          {info.props.map(this.renderInfoValue.bind(this))}
        </View>
      </View>
      );
  }


  renderDescription() {
    const { structureid, getStructureDescription } = this.props;
    const genComp = getStructureDescription(structureid);

    if (genComp === null)
      return null;

    return (
      <View style={myStyle.freeTextView}>
        {genComp()}
      </View>
      );
  }


  render() {
    const { style, title, subtitle } = this.props;
    const renderInfo = this.renderInfo.bind(this);
    const infoNames = ['phone', 'openings', 'mail', 'web', 'address'];
    const infoIcons = [
      require('../../images/phone.png'),
      require('../../images/clock.png'),
      require('../../images/mail.png'),
      require('../../images/website.png'),
      require('../../images/website.png'),
    ];

    const renderableInfos = [];
    for (let infoIdx = 0; infoIdx < infoNames.length; ++infoIdx) {
      const infoPrefix = infoNames[infoIdx];
      const infoProps = [];

      for (const k of Object.keys(this.props)) {
        if (k.startsWith(infoPrefix) && this.props[k]) {
          infoProps.push(k);
        }
      }

      infoProps.sort();

      if (infoProps.length > 0) {
        renderableInfos.push({
          icon: infoIcons[infoIdx],
          props: infoProps,
        });
      }
    }

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
          {renderableInfos.map(renderInfo)}
          {this.renderDescription()}
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
  structureid: React.PropTypes.string.isRequired,
  getStructureDescription: React.PropTypes.func.isRequired,
};


const myStyle = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: 'red',
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
  },
  titleText: {
    fontFamily: 'GillSans-Bold',
    fontSize: structureitem.titleFontSize,
    color: structureitem.fontColor,
  },
  subtitleText: {
    fontFamily: 'GillSans',
    fontSize: structureitem.subtitleFontSize,
    color: structureitem.fontColor,
  },
  infosView: {
    marginLeft: structureitem.markerWidth + structureitem.markerTitleGap,
    marginTop: structureitem.titleInfoGap,
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: structureitem.iconSide,
    height: structureitem.iconSide,
    resizeMode: 'contain',
    marginRight: structureitem.iconValuesGap,
  },
  infoSpacing: {
    marginTop: structureitem.infoSpacing,
  },
  infoValuesView: {
    flex: 1,
  },
  infoValueText: {
    fontFamily: 'GillSans',
    fontSize: structureitem.infoFontSize,
    color: structureitem.fontColor,
  },
  infoLink: {
    color: '#74B3FA',
  },
  freeTextView: {
    marginTop: structureitem.freeTextSpacing,
  },
});
