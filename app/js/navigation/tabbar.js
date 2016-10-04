'use strict';

import React, { Component } from 'react';
import { View, Text, TabBarIOS, StyleSheet } from 'react-native';

import AppNavigator from './navigator';

import { custom } from '../pages';
const { About, Sponsor, Path } = custom;

import { blocks } from '../style';
const { tabbar } = blocks;



export default class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 'home' };
  }


  onTabPress(text) {
    this.setState({ selectedTab: text });
  }


  render() {
    const createCb = (text) => () => this.onTabPress.bind(this)(text);

    return (
      <TabBarIOS unselectedTintColor={tabbar.textUnselectedColor}
                 tintColor={tabbar.textSelectedColor}
                 barTintColor={tabbar.barColor}
                 >
        <TabBarIOS.Item title='profilo'
                        icon={tabbar.profileUnselectedIcon}
                        selectedIcon={tabbar.profileSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'profile'}
                        // onPress={createCb('profile')}
                        >
        </TabBarIOS.Item>
        <TabBarIOS.Item title='percorso'
                        icon={tabbar.pathUnselectedIcon}
                        selectedIcon={tabbar.pathSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'path'}
                        onPress={createCb('path')}
                        >
          <Path />
        </TabBarIOS.Item>
        <TabBarIOS.Item title='home'
                        icon={tabbar.homeUnselectedIcon}
                        selectedIcon={tabbar.homeSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'home'}
                        onPress={createCb('home')}
                        >
          <AppNavigator />
        </TabBarIOS.Item>
        <TabBarIOS.Item title='about LILT'
                        icon={tabbar.aboutUnselectedIcon}
                        selectedIcon={tabbar.aboutSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'about'}
                        onPress={createCb('about')}
                        >
          <About />
        </TabBarIOS.Item>
        <TabBarIOS.Item title='sponsor'
                        icon={tabbar.sponsorUnselectedIcon}
                        selectedIcon={tabbar.sponsorSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'sponsor'}
                        onPress={createCb('sponsor')}
                        >
          <Sponsor />
        </TabBarIOS.Item>
      </TabBarIOS>
      );
  }
}


const myStyle = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});
