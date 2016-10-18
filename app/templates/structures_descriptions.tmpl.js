'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { openURL } from '../../misc';

import { blocks } from '../../style';
const { structureitem: st } = blocks;


// ---------------- Generated code ---------------------------------------------
{{components}}


const idToComp = {
{{mappings}}
};
// -----------------------------------------------------------------------------


const markdown = StyleSheet.create({
  container: {
      flex: 1,
    },
    header: {
      fontFamily: 'GillSans-Bold',
      fontSize: st.infoFontSize - 2,
      marginTop: st.infoSpacing,
      marginBottom: st.infoSpacing,
      color: st.fontColor,
    },
    paragraph: {
      // marginTop: st.infoSpacing,
      // marginBottom: st.infoSpacing,
    },
    paragraphText: {
      fontFamily: 'GillSans',
      fontSize: st.infoFontSize,
      color: st.fontColor,
    },
    image: {},
    text: {},
    link: {
      color: '#74B3FA',
    },
    emphasis: {
      fontStyle: 'italic',
    },
    doubleEmphasis: {
      fontFamily: 'GillSans-Bold',
    },
});


const getStructureDescription = (structureId) => {
  if (idToComp.hasOwnProperty(structureId))
    return idToComp[structureId];
  return null;
};

module.exports = getStructureDescription;
