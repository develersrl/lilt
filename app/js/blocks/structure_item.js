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

import { openURL, extractPhoneNumber } from '../misc';

import { blocks } from '../style';
const { structureitem } = blocks;


/**
 * Setup simple enum to discriminate between special breast unit structures.
 */
const BreastUnit = {
  CAREGGI_MAIN: 0,
  CAREGGI_CORD: 1,
  OTHER: 2,
};


export default class StructureItem extends Component {
  isCareggiMain() {
    const { structuretype, title } = this.props;

    // Filter non-breastunit structures
    if (structuretype !== 'breastunit')
      return false;

    // Match title substring
    if (title.startsWith('CENTRO DI SENOLOGIA AOU CAREGGI'))
      return true;

    return false;
  }


  isCareggiCORD() {
    const { structuretype, title } = this.props;

    // Filter non-breastunit structures
    if (structuretype !== 'breastunit')
      return false;

    if (this.isCareggiMain())
      return false;

    if (title.startsWith('Ospedale'))
      return false;

    return true;
  }


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

    const infoText = this.props[propName].split('\\n').join('\n');
    const textBlock = (
      <Text style={valueStyle}>
        {infoText}
      </Text>
      );

    const containerStyle = [];
    if (index > 0)
      containerStyle.push(myStyle.valueSpacing);

    // If this is a simple text info we return the text block
    if (valueType === 'text')
      return (<View key={index} style={containerStyle}>{textBlock}</View>);

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
        <TouchableOpacity style={containerStyle} key={index} onPress={cb}>
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
        <View style={containerStyle} key={index}>
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
      // Extract phone token and text token (text may be empty)
      const tokens = extractPhoneNumber(this.props[propName]);

      // Compute telephone link
      let telLink = 'tel:' + tokens[0];
      telLink = telLink.split(' ').join('');

      // There may be extra text after the phone number.
      // If so, we wrap it into a text element
      let extraText = null;
      if (tokens[1] !== '') {
        tokens[1] = tokens[1].split('\\n').join('\n');
        extraText = (<Text style={myStyle.infoValueText}>{tokens[1]}</Text>);
      }

      return (
        <View style={containerStyle} key={index}>
          <Text>
            <Text style={valueStyle}
                  onPress={() => openURL(telLink)}>
              {tokens[0]}
            </Text>
            {extraText}
          </Text>
        </View>
        );
    }

    return (
      <View style={containerStyle}>
        {textBlock}
      </View>
      );
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


  renderTitleAndSubtitle() {
    const { title, subtitle } = this.props;

    let subtitleElement = null;
    if (subtitle && subtitle !== '')
      subtitleElement = (<Text style={myStyle.subtitleText}>{subtitle}</Text>);

    let careggiMainBreastUnit = null;
    if (this.isCareggiMain())
      careggiMainBreastUnit = (
        <Text style={myStyle.titleText}>BREAST UNIT</Text>
        );

    let titleTextBlock = null;
    let markerImage = require('../../images/transparent.png');
    if (!this.isCareggiCORD()) {
      titleTextBlock = (<Text style={myStyle.titleText}>{title}</Text>);
      markerImage = require('../../images/marker-orange.png');
    }

    return (
      <View style={myStyle.firstRow}>
        <Image style={myStyle.titleMarker}
               source={markerImage}
               />
        <View style={myStyle.titleView}>
          {titleTextBlock}
          {careggiMainBreastUnit}
          {subtitleElement}
        </View>
      </View>
      );
  }


  renderCareggiMainAdditionalInfos() {
    if (!this.isCareggiMain())
      return null;

    const valueStyle = [myStyle.infoValueText, myStyle.infoLink];
    const infoText = 'rxsenologica@aou.careggi.toscana.it';

    const textBlock = (
      <Text style={valueStyle}
            onPress={() => openURL('mailto:' + infoText)}
            >
        {infoText}
      </Text>
      );

    const infoViewStyle = [myStyle.infoView, myStyle.infoSpacing];

    return (
      <View style={{marginTop: 30}}>
        <Text style={myStyle.subtitleText}>Diagnostica Senologica</Text>
        <View style={infoViewStyle}>
          <Image style={myStyle.infoIcon}
               source={require('../../images/mail.png')}
               />
          {textBlock}
        </View>
      </View>
      );
  }


  render() {
    const { style } = this.props;
    const renderInfo = this.renderInfo.bind(this);
    const infoNames = ['phone', 'openings', 'mail', 'web', 'address'];
    const infoIcons = [
      require('../../images/phone.png'),
      require('../../images/clock.png'),
      require('../../images/mail.png'),
      require('../../images/website.png'),
      require('../../images/address.png'),
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
        {this.renderTitleAndSubtitle()}
        <View style={myStyle.infosView}>
          {renderableInfos.map(renderInfo)}
          {this.renderCareggiMainAdditionalInfos()}
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
    lineHeight: structureitem.valueLineHeight,
  },
  infoLink: {
    color: '#74B3FA',
  },
  freeTextView: {
    marginTop: structureitem.freeTextSpacing,
  },
  valueSpacing: {
    marginTop: structureitem.valuesSpacing,
  },
});
