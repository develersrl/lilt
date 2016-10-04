'use strict';

import React, { Component } from 'react';
import { TabBarIOS, StyleSheet } from 'react-native';

import AppNavigator from './navigator';

import { custom } from '../pages';
const { About, ThanksTo, Structures } = custom;

import { blocks } from '../style';
const { tabbar } = blocks;



export default class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 'path' };
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
        <TabBarIOS.Item title='strutture'
                        icon={tabbar.structuresUnselectedIcon}
                        selectedIcon={tabbar.structuresSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'structures'}
                        onPress={createCb('structures')}
                        >
          <Structures />
        </TabBarIOS.Item>
        <TabBarIOS.Item title='percorso'
                        icon={tabbar.pathUnselectedIcon}
                        selectedIcon={tabbar.pathSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'path'}
                        onPress={createCb('path')}
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
        <TabBarIOS.Item title='grazie a'
                        icon={tabbar.sponsorUnselectedIcon}
                        selectedIcon={tabbar.sponsorSelectedIcon}
                        renderAsOriginal={true}
                        selected={this.state.selectedTab === 'sponsor'}
                        onPress={createCb('sponsor')}
                        >
          <ThanksTo />
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
