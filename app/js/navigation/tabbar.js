'use strict';

import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import Mixpanel from 'react-native-mixpanel';

import AppNavigator from './navigator';
import ProfileNavigator from './profile_navigator';

import { api as stateApi } from '../state';

import { custom } from '../pages';
const { About, ThanksTo, Structures } = custom;

import { blocks } from '../style';
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
    const titleToMixpanelEvent = {
      profile: 'Tab Profilo',
      structures: 'Tab Strutture',
      home: 'Tab Home',
      about: 'Tab About',
      sponsor: 'Tab Sponsor',
    };

    const createCb = (text) => () => {
      Mixpanel.track(titleToMixpanelEvent[text]);
      this.onTabPress.bind(this)(text);
    };

    const selectedTab = stateApi.selectedTab();

    return (
      <TabBarIOS unselectedTintColor={tabbar.textUnselectedColor}
                 tintColor={tabbar.textSelectedColor}
                 barTintColor={tabbar.barColor}
                 >
        <TabBarIOS.Item title={'profilo'}
                        icon={tabbar.profileUnselectedIcon}
                        selectedIcon={tabbar.profileSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'profile'}
                        onPress={createCb('profile')}
                        >
          <ProfileNavigator />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'strutture'}
                        icon={tabbar.structuresUnselectedIcon}
                        selectedIcon={tabbar.structuresSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'structures'}
                        onPress={createCb('structures')}
                        >
          <Structures />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'home'}
                        icon={tabbar.homeUnselectedIcon}
                        selectedIcon={tabbar.homeSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'home'}
                        onPress={createCb('home')}
                        >
          <AppNavigator />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'about LILT'}
                        icon={tabbar.aboutUnselectedIcon}
                        selectedIcon={tabbar.aboutSelectedIcon}
                        renderAsOriginal={true}
                        selected={selectedTab === 'about'}
                        onPress={createCb('about')}
                        >
          <About />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'grazie a'}
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
