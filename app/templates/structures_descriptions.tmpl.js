'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { blocks } from '../../style';
const { markdown } = blocks;


// ---------------- Generated code ---------------------------------------------
{{components}}


const idToComp = {
{{mappings}}
};
// -----------------------------------------------------------------------------


const getStructureDescription = (structureId) => {
  if (idToComp.hasOwnProperty(structureId))
    return idToComp[structureId];
  return null;
};

module.exports = getStructureDescription;
