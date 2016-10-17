'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';


// ---------------- Generated code ---------------------------------------------
class MyMarkdown extends Component {
  render() {
    return (
      <View>
        <Text>Hello MyMarkdown</Text>
      </View>
      );
  }
}


const idToComp = {
  'myId': () => <MyMarkdown />,
};
// -----------------------------------------------------------------------------


const getStructureDescription = (structureId) => {
  console.log('Retrieving description for structure: ' + structureId);
  return idToComp['myId'];
  if (idToComp.hasOwnProperty(structureId))
    return idToComp[structureId];
  return null;
};

module.exports = getStructureDescription;
