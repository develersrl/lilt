/* ---------------- imports --------------------------------------------------------------------- */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import AppNavigator from './navigator';
import ProfileNavigator from './profile_navigator';

import { api as stateApi } from '../state';

import { custom } from '../pages';
const { About, ThanksTo, Structures } = custom;

import { blocks } from '../style';
const { tabbar } = blocks;

const selectedTabToIndex = {
  profile: 0,
  structures: 1,
  home: 2,
  about: 3,
  sponsor: 4,
};

const indexToSelectedTab = ['profile', 'structures', 'home', 'about', 'sponsor'];
/* ---------------------------------------------------------------------------------------------- */


/* ---------------- Misc ------------------------------------------------------------------------ */
const onBarElementPress = (index) => {
  stateApi.setSelectedTab(indexToSelectedTab[index]);
};
/* ---------------------------------------------------------------------------------------------- */


/* ---------------- TabBar ---------------------------------------------------------------------- */
class MyTabBar extends Component {
  constructor(props) {
    super(props);
    this.icons = [
      { selected: tabbar.profileSelectedIcon, unselected: tabbar.profileUnselectedIcon },
      { selected: tabbar.structuresSelectedIcon, unselected: tabbar.structuresUnselectedIcon },
      { selected: tabbar.homeSelectedIcon, unselected: tabbar.homeUnselectedIcon },
      { selected: tabbar.aboutSelectedIcon, unselected: tabbar.aboutUnselectedIcon },
      { selected: tabbar.sponsorSelectedIcon, unselected: tabbar.sponsorUnselectedIcon },
    ];
  }


  renderBarElement(text, i) {
    const { activeTab } = this.props;
    const icon = (activeTab === i) ? this.icons[i].selected : this.icons[i].unselected;

    const textStyle = [myStyle.barElementText];
    if (activeTab === i)
      textStyle.push(myStyle.barElementTextSelected);

    return (
      <TouchableWithoutFeedback key={i} onPress={() => onBarElementPress(i)}>
        <View style={myStyle.barElement}>
          <Image source={icon} />
          <Text style={textStyle}>{text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }


  render() {
    return (
      <View style={myStyle.tabBar}>
        {this.props.tabs.map(this.renderBarElement.bind(this))}
      </View>
    );
  }
}


MyTabBar.propTypes = {
  goToPage: React.PropTypes.func,
  activeTab: React.PropTypes.number,
  tabs: React.PropTypes.array,
};
/* ---------------------------------------------------------------------------------------------- */


/* ---------------- TabView --------------------------------------------------------------------- */
export default class TabBar extends Component {
  componentDidMount() {
    stateApi.addListener(this);
  }


  componentWillUnmount() {
    stateApi.removeListener(this);
  }


  onStateChange() {
    this.forceUpdate();
  }


  render() {
    const selectedTab = stateApi.selectedTab();

    return (
      <ScrollableTabView tabBarPosition={'bottom'}
                         renderTabBar={() => <MyTabBar />}
                         initialPage={selectedTabToIndex[stateApi.initialTab]}
                         page={selectedTabToIndex[selectedTab]}
                         onChangeTab={({ i }) => onBarElementPress(i)}
                         locked={true}
                         scrollWithoutAnimation={true}
                         >
        <ProfileNavigator tabLabel={'profilo'} />
        <Structures tabLabel={'strutture'} />
        <AppNavigator tabLabel={'home'} />
        <About tabLabel={'about'} />
        <ThanksTo tabLabel={'grazie a'} />
      </ScrollableTabView>
    );
  }
}
/* ---------------------------------------------------------------------------------------------- */


const myStyle = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: tabbar.barColor,
  },
  barElement: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: tabbar.elementTopBottomPadding,
    paddingBottom: tabbar.elementTopBottomPadding,
  },
  barElementText: {
    fontSize: 11,
    color: tabbar.textUnselectedColor,
  },
  barElementTextSelected: {
    color: tabbar.textSelectedColor,
  },
});
