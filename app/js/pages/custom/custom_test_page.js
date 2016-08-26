'use strict';

import React, { Component } from 'react';
import { View, ActionSheetIOS } from 'react-native';

import { common } from '../../style';
import { Button } from '../../blocks';
import { api as stateApi } from '../../state';


/* eslint-disable no-console */
export default class CustomTestPage extends Component {
  testShareSheet() {
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


  render() {
    const { flexible } = common;
    const { navigator, getRoute } = this.props;

    return (
      <View style={[flexible]}>
        <Button text="Open Link List"
                onPress={() => navigator.push(getRoute('link-list'))} />
        <Button text="Open Sharesheet" onPress={this.testShareSheet} />
        <Button text="Test Services" onPress={stateApi.test} />
      </View>
      );
  }
}
/* eslint-enable no-console */
