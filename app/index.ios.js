/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Linking,
  MapView,
} from 'react-native';

import * as generated from './js/gen';
import * as blocks from './js/blocks';


class lilt extends Component {
  renderExternalLink() {
    return (
      <TouchableHighlight
          underlayColor={'#666666'}
          onPress={() => Linking.openURL('http://www.google.com')}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
      </TouchableHighlight>
      );
  }

  renderMap() {
    return (
      <MapView style={styles.map}
               annotations={[{longitude: 12.40, latitude: 41.90 }]} />
      );
  }

  render() {
    const { Test } = generated;
    const { Expandable } = blocks;

    return (
      <View style={styles.container}>
        <Expandable title={'Expandable Title'} content={() => <Test />} />
        <View style={styles.flexible} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  expandable: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  flexible: {
    flex: 1,
  },
  debug: {
    borderWidth: 1,
    borderColor: '#00FF00',
  },
});


AppRegistry.registerComponent('lilt', () => lilt);
