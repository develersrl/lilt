'use strict';

import React, { Component } from 'react';
import { TabBarIOS, StyleSheet } from 'react-native';

import AppNavigator from './navigator';
import ProfileNavigator from './profile_navigator';

import { api as stateApi } from '../state';

import { custom } from '../pages';
const { About, ThanksTo, Structures } = custom;

import { blocks, common } from '../style';
const { tabbar } = blocks;



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


  onTabPress(text) {
    stateApi.setSelectedTab(text);
  }


  render() {
    const createCb = (text) => () => this.onTabPress.bind(this)(text);
    const selectedTab = stateApi.selectedTab();

    return (
      <TabBarIOS unselectedTintColor={tabbar.textUnselectedColor}
                 tintColor={tabbar.textSelectedColor}
                 barTintColor={tabbar.barColor}
                 >
        <TabBarIOS.Item style={myStyle.item}
                        title={'profilo'}
                        icon={tabbar.profileUnselectedIcon}
                        selectedIcon={tabbar.profileSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'profile'}
                        onPress={createCb('profile')}
                        >
          <ProfileNavigator />
        </TabBarIOS.Item>
        <TabBarIOS.Item style={myStyle.item}
                        title={'strutture'}
                        icon={tabbar.structuresUnselectedIcon}
                        selectedIcon={tabbar.structuresSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'structures'}
                        onPress={createCb('structures')}
                        >
          <Structures />
        </TabBarIOS.Item>
        <TabBarIOS.Item style={myStyle.item}
                        title={'percorso'}
                        icon={tabbar.pathUnselectedIcon}
                        selectedIcon={tabbar.pathSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'path'}
                        onPress={createCb('path')}
                        >
          <AppNavigator />
        </TabBarIOS.Item>
        <TabBarIOS.Item style={myStyle.item}
                        title={'about LILT'}
                        icon={tabbar.aboutUnselectedIcon}
                        selectedIcon={tabbar.aboutSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'about'}
                        onPress={createCb('about')}
                        >
          <About />
        </TabBarIOS.Item>
        <TabBarIOS.Item style={myStyle.item}
                        title={'grazie a'}
                        icon={tabbar.sponsorUnselectedIcon}
                        selectedIcon={tabbar.sponsorSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'sponsor'}
                        onPress={createCb('sponsor')}
                        >
          <ThanksTo />
        </TabBarIOS.Item>
      </TabBarIOS>
      );
  }
}


const myStyle = StyleSheet.create({
  item: {
    marginBottom: common.tabBarHeight,
  },
});
