'use strict';

import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
  ListView,
} from 'react-native';

import { api as stateApi } from '../../state';
import { SegmentControl, StructureItem } from '../../blocks';

import { common, pages } from '../../style';
const { structures } = pages;


export default class Structures extends Component {
  constructor(props) {
    super(props);
    const tabLabels = stateApi.getStructureTypes();
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      selectedIndex: 0,
      tabLabels,
      dataSource: this.computeNewDataSource(dataSource, tabLabels[0]),
    };
  }


  computeNewDataSource(dataSource, newSegment) {
    const newStructures = stateApi.getStructuresForTranslatedType(newSegment);
    return dataSource.cloneWithRows(newStructures);
  }


  onSegmentChange(newSegment) {
    this.setState({
      ...this.state,
      dataSource: this.computeNewDataSource(this.state.dataSource, newSegment),
    });
  }


  renderStructure(structureData, sectionID, rowID) {
    let itemProps = { ...structureData };
    if (rowID > 0)
      itemProps = { ...itemProps, style: myStyle.listItemSpacing };

    return (
      <StructureItem {...itemProps} />
      );
  }


  render() {
    const { selectedIndex, tabLabels, dataSource } = this.state;

    return (
      <View style={myStyle.container}>
        <View style={myStyle.aboveView}>
          <Text style={myStyle.titleText}>STRUTTURE</Text>
          <Text style={myStyle.subtitleText}>
            Lorem ipsum dolor sit amet, consectetur adipicing elit.
            Nunc dapibus id orci feugiat vulputate.
          </Text>
        </View>
        <View style={myStyle.belowView}>
          <SegmentControl values={tabLabels}
                          selectedIndex={selectedIndex}
                          tintColor={structures.segmentsColor}
                          onValueChange={this.onSegmentChange.bind(this)}
                          />
          <ListView style={myStyle.listView}
                    dataSource={dataSource}
                    automaticallyAdjustContentInsets={false}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    renderRow={this.renderStructure}
                    contentContainerStyle={myStyle.listViewContainer}
                    />
        </View>
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: common.statusBarHeight,
  },
  aboveView: {
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
  titleText: {
    color: '#FF9C8D',
    fontFamily: 'GillSans-Bold',
    fontSize: structures.titleFontSize,
    textAlign: 'center',
  },
  subtitleText: {
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: structures.titleSubtitleGap,
    fontFamily: 'GillSans',
    fontSize: structures.subtitleFontSize,
  },
  belowView: {
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  listViewContainer: {
    paddingLeft: structures.listLeftRightPadding,
    paddingRight: structures.listLeftRightPadding,
    paddingTop: structures.listTopBottomPadding,
    paddingBottom: structures.listTopBottomPadding,
  },
  listItemSpacing: {
    marginTop: structures.listItemsSpacing,
  },
});
