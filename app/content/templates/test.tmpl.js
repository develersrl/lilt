'use strict';

import React, { Component } from 'react';
import { View, Text, ScrollView, Image, ActionSheetIOS } from 'react-native';

import * as style from '../style';
import * as blocks from '../blocks';


export default class Test extends Component {
  /*
  testShare() {
    console.log('sharing');
    ActionSheetIOS.showShareActionSheetWithOptions({
      message: 'message to go with the shared url',
      subject: 'a subject to go in the email heading',
    },
    (error) => console.log(error),
    (success, method) => {
      if (success) {
        console.log(`Shared via ${method}`);
      }
      else {
        console.log('You didn\'t share');
      }
    });
  }
  */

  render() {
    const { flexible, centeredChildren, stretch, row } = style.common;
    const { markdown, image } = style.blocks;
    const { Button } = blocks;

    return (
      <View style={[flexible, centeredChildren]}>
        <View style={[flexible, stretch]}>
          {{testButton}}
        </View>

        {{testMarkdown}}

        {{testArray}}
      </View>
      );
  }
}
