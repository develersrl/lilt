import React, { Component } from 'react';
import { StyleSheet, TextInput, Image, View } from 'react-native';

import { blocks } from '../style';
const { searchBar } = blocks;


export default class SearchAndroid extends Component {
  constructor(props) {
    super(props);
    this.state = { text: props.initValue };
    this.onChangeText = this.onChangeText.bind(this);
  }


  onChangeText(text) {
    this.setState({ text });
    this.props.onChangeText(text);
  }


  render() {
    const { placeholder, imageSource } = this.props;
    const { text } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <Image style={styles.image} source={imageSource} />
          <TextInput style={styles.searchText}
                    placeholder={placeholder}
                    placeholderTextColor={searchBar.placeholderColor}
                    value={text}
                    underlineColorAndroid={'transparent'}
                    onChangeText={this.onChangeText}
                    autoCorrect={false}
                    />
        </View>
      </View>
    );
  }
}


SearchAndroid.propTypes = {
  placeholder: React.PropTypes.string.isRequired,
  initValue: React.PropTypes.string,
  onChangeText: React.PropTypes.func.isRequired,
  imageSource: React.PropTypes.number,
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: searchBar.outerViewBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: searchBar.contentPadding,
    height: searchBar.height,
    borderRadius: 7,
    backgroundColor: 'white',
  },
  searchText: {
    flex: 1,
    color: searchBar.textColor,
    textAlign: 'left',
    fontFamily: searchBar.fontFamily,
    fontSize: searchBar.fontSize,
    height: searchBar.height,
  },
  image: {
    width: searchBar.imageWidth,
    height: searchBar.height - 2 * searchBar.contentPadding,
    resizeMode: 'contain',
    marginLeft: 7,
    marginRight: 7,
  },
});
