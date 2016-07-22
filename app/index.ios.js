/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  View,
  /*
  Text,
  TouchableHighlight,
  Linking,
  MapView,
  */
} from 'react-native';

import * as pages from './js/pages';


class lilt extends Component {
  /*
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
  */

  render() {
    const { StartPage } = pages;

    return (
      <View style={styles.container}>
        <StartPage />
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
});


AppRegistry.registerComponent('lilt', () => lilt);
