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


class lilt extends Component {
  render() {
    const { Test } = generated;

    console.log(generated);
    return (
      <View style={styles.container}>
        <TouchableHighlight underlayColor={'#666666'}
                            onPress={() => Linking.openURL('http://www.google.com')}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
        </TouchableHighlight>
        <Test />
        <MapView style={styles.map}
                 annotations={[{
                   longitude: 12.40,
                   latitude: 41.90,
                 }]}
                  />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});


AppRegistry.registerComponent('lilt', () => lilt);
