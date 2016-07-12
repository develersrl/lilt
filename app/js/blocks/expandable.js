// @flow
'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

import * as style from '../style';


export default class Expandable extends Component {

  /* eslint-disable react/sort-comp */
  state: {
    expanded: boolean,
  };

  props: {
    title: string,
    content: () => ReactClass<{}>,  // eslint-disable-line no-undef
  };


  constructor(props: any) {
    super(props);
    this.state = { expanded: false };
  }


  componentWillUpdate(nextProps: any, nextState: any) {
    if (nextState.expanded !== this.state.expanded)
      LayoutAnimation.easeInEaseOut();
  }


  onSignPress() {
    this.setState({ expanded: !this.state.expanded });
  }


  renderTitle() {
    const {
      titleView,
      imgView,
      signImg,
      titleTextView
    } = style.blocks.expandable;

    const { centeredChildren, mediumText, debug, debug1 } = style.common;
    const { title } = this.props;

    let imgSource = '';
    if (this.state.expanded) {
      imgSource = require('../../images/minus.png');
    }
    else {
      imgSource = require('../../images/plus.png');
    }

    return (
      <TouchableOpacity onPress={this.onSignPress.bind(this)}>
        <View style={titleView}>
          <View style={[imgView, centeredChildren, debug1]}>
            <Image style={[signImg, debug]} source={imgSource} />
          </View>
          <View style={titleTextView}>
            <Text style={mediumText}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
      );
  }


  renderContent() {
    const { expanded } = this.state;

    if (!expanded)
      return null;

    const { contentView } = style.blocks.expandable;
    const { content } = this.props;
    const { debug } = style.common;

    return (
      <View style={[contentView, debug]}>
        {content()}
      </View>
      );
  }


  render() {
    const { container } = style.blocks.expandable;

    return (
      <View style={container}>
        {this.renderTitle()}
        {this.renderContent()}
      </View>
      );
  }
}
