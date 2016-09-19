'use strict';

import React, { Component } from 'react';
import { View, ScrollView, Image, Text, StyleSheet } from 'react-native';
import { blocks, common } from '../style';

const { stripe } = blocks;


export default class Stripe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: this.computeStyleSheet(),
      selectedIndex: 0,
      pageWidth: this.computePageWidth(),
    };
  }


  computePageWidth() {
    const { imageSize } = this.props;
    return imageSize[0] + stripe.spacing;
  }


  computeStyleSheet() {
    const { imageSize } = this.props;

    return StyleSheet.create({
      container: {
        height: imageSize[1] + stripe.footerHeight,
        marginTop: stripe.marginTopBottom,
        marginBottom: stripe.marginTopBottom,
      },
      scrollview: {
        height: imageSize[1],
      },
      image: {
        width: imageSize[0],
        height: imageSize[1],
        resizeMode: 'contain',
      },
      imageSpace: {
        marginLeft: stripe.spacing,
      },
      circle: {
        width: stripe.footerHeight / 3,
        height: stripe.footerHeight / 3,
        borderRadius: stripe.footerHeight / 6,
        backgroundColor: stripe.circleUnselected,
      },
      circleSpace: {
        marginLeft: stripe.circleSpacing,
      },
      circleSelected: {
        backgroundColor: stripe.circleSelected,
      },
      footer: {
        flexDirection: 'row',
        height: stripe.footerHeight,
      },
    });
  }


  onImagesScroll(ev) {
    // https://stackoverflow.com/questions/29503252
    const elWidth = this.state.pageWidth;
    let newIndex = (ev.nativeEvent.contentOffset.x + elWidth / 2) / elWidth;

    if (newIndex < 0) {
      // this can happen if scroll view bounces on the left
      newIndex = 0;
    }
    else {
      newIndex = Math.floor(newIndex);
    }

    this.setState({ ...this.state, selectedIndex: newIndex });
  }


  createStripeImage(imageSource, index) {
    const { image, imageSpace } = this.state.style;

    const imageStyle = [image];
    if (index > 0)
      imageStyle.push(imageSpace);

    return (
      <Image style={imageStyle} key={index} source={imageSource} />
      );
  }


  createCircle(imageSource, index) {
    const { circle, circleSpace, circleSelected } = this.state.style;

    const circleStyle = [circle];
    if (index === this.state.selectedIndex)
      circleStyle.push(circleSelected);
    if (index > 0)
      circleStyle.push(circleSpace);

    return (
      <View key={index} style={circleStyle} />
      );
  }


  renderStripe() {
    return (
      <View style={this.state.style.container}>
        <ScrollView style={this.state.style.scrollview}
                    contentInset={{top: 0}}
                    automaticallyAdjustContentInsets={false}
                    snapToInterval={this.state.pageWidth}
                    horizontal={true}
                    onScroll={this.onImagesScroll.bind(this)}
                    scrollEventThrottle={300}
                    showsHorizontalScrollIndicator={false}>
          {this.props.sources.map(this.createStripeImage.bind(this))}
        </ScrollView>
        <View style={[this.state.style.footer, common.centeredChildren]}>
          {this.props.sources.map(this.createCircle.bind(this))}
        </View>
      </View>
      );
  }


  render() {
    // if there are no images in the stripe show a text
    if (this.props.sources.length === 0) {
      return (
        <View style={[this.state.style.container, common.centeredChildren]}>
          <Text>No Images</Text>
        </View>
        );
    }

    return this.renderStripe();
  }
}
