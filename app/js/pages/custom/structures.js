'use strict';

import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
  ListView,
  Platform,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { api as stateApi } from '../../state';
import { SegmentControl, StructureItem } from '../../blocks';
import { getStructureDescription } from '../generated';

import { common, pages } from '../../style';
const { structures } = pages;


export default class Structures extends Component {
  constructor(props) {
    super(props);
    const tabLabels = stateApi.getStructureTypes();
    const dataSources = [];

    for (let i = 0; i < tabLabels.length; i++) {
      dataSources.push(
        this.computeNewDataSource(new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
        }), tabLabels[i])
      );
    }

    this.state = {
      selectedIndex: 0,
      tabLabels,
      dataSources,
      currentDataSource: dataSources[0],
    };

    this.onSegmentChange = this.onSegmentChange.bind(this);
  }


  computeNewDataSource(dataSource, newSegment) {
    const newStructures = stateApi.getStructuresForTranslatedType(newSegment);
    return dataSource.cloneWithRows(newStructures);
  }


  onSegmentChange(newSegment, index) {
    this.setState({
      ...this.state,
      selectedIndex: index,
      currentDataSource: this.state.dataSources[index],
    });
  }


  renderStructure(structureData, sectionID, rowID) {
    let itemProps = { ...structureData, getStructureDescription };
    if (rowID > 0)
      itemProps = { ...itemProps, style: myStyle.listItemSpacing };

    return (
      <StructureItem {...itemProps} />
      );
  }


  renderIOS() {
    const { selectedIndex, tabLabels, currentDataSource } = this.state;

    return (
      <View style={myStyle.belowView}>
        <SegmentControl values={tabLabels}
                        selectedIndex={selectedIndex}
                        tintColor={structures.segmentsColor}
                        onValueChange={this.onSegmentChange}
                        />
        <ListView style={myStyle.listView}
                  dataSource={currentDataSource}
                  automaticallyAdjustContentInsets={false}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  renderRow={this.renderStructure}
                  contentContainerStyle={myStyle.listViewContainer}
                  />
      </View>
      );
  }

  renderAndroid() {
    const { tabLabels, dataSources } = this.state;

    const tabElements = dataSources.map((source, i) => (
      <ListView style={myStyle.listView}
                dataSource={source}
                key={i}
                tabLabel={tabLabels[i]}
                automaticallyAdjustContentInsets={false}
                bounces={false}
                showsVerticalScrollIndicator={false}
                renderRow={this.renderStructure}
                contentContainerStyle={myStyle.listViewContainer}
                />
    ));

    return (
      <View style={myStyle.belowView}>
        <ScrollableTabView
          tabBarActiveTextColor='#93B8D8'
          tabBarInactiveTextColor='#C9D5F1'
          tabBarTextStyle={myStyle.androidTab}
          tabBarUnderlineStyle={myStyle.androidTabUnderline}
          >
          {tabElements}
        </ScrollableTabView>
      </View>
      );
  }

  render() {
    return (
      <View style={myStyle.container}>
        <View style={myStyle.aboveView}>
          <Text style={myStyle.titleText}>STRUTTURE</Text>
          <Text style={myStyle.subtitleText}>
            Contatti delle strutture nell’area fiorentina{'\n'}
            a cui fare riferimento
          </Text>
        </View>
        {
          Platform.select({
            ios: this.renderIOS(),
            android: this.renderAndroid()
          })
        }
      </View>
      );
  }
}


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: { marginTop: common.statusBarHeight, marginBottom: 50 },
      android: { backgroundColor: 'white' },
    }),
  },
  androidTab: {
    fontFamily: 'GillSans',
    fontSize: 14,
  },
  androidTabUnderline: {
    backgroundColor: '#93B8D8',
    height: 3,
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
