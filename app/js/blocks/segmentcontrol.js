'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { blocks } from '../style';
const { segmentcontrolios: st } = blocks;


export default class SegmentControl extends Component {
  constructor(props) {
    super(props);
    const { selectedIndex } = this.props;
    this.state = { selectedIndex };
  }


  onTabPress(caption, index) {
    const { onValueChange } = this.props;
    this.setState({ selectedIndex: index });
    onValueChange(caption, index);
  }


  renderLabel(caption, index) {
    const { selectedIndex } = this.state;
    const viewStyle = [myStyle.tabView];
    const textStyle = [myStyle.tabText];

    if (index === selectedIndex) {
      viewStyle.push(myStyle.tabViewSelected);
      textStyle.push(myStyle.tabTextSelected);
    }

    return (
      <TouchableOpacity style={viewStyle}
                        key={index}
                        onPress={() => this.onTabPress(caption, index)}
                        activeOpacity={st.activeOpacity}
                        >
        <Text style={textStyle}>{caption}</Text>
      </TouchableOpacity>
      );
  }


  render() {
    const { style, values } = this.props;

    return (
      <View style={style}>
        <View style={myStyle.valuesRow}>
          {values.map(this.renderLabel.bind(this))}
        </View>
        <View style={myStyle.footer}>
        </View>
      </View>
      );
  }
}


SegmentControl.propTypes = {
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  selectedIndex: React.PropTypes.number,
  onValueChange: React.PropTypes.func,
};


const myStyle = StyleSheet.create({
  valuesRow: {
    flexDirection: 'row',
    height: st.valuesRowHeight,
    backgroundColor: st.backgroundColor,
  },
  footer: {
    height: st.footerHeight,
    backgroundColor: st.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: st.separatorColor,
  },
  tabView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabViewSelected: {
    backgroundColor: st.selectedBackgroundColor,
  },
  tabText: {
    fontFamily: 'GillSans',
    fontSize: st.normalFontSize,
    color: st.fontColor,
  },
  tabTextSelected: {
    fontFamily: 'GillSans-Bold',
    fontSize: st.selectedFontSize,
    color: st.fontColor,
  },
});
