/* @flow */

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import images from '../assets/images';

export default class FavoriteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
  }

  onPress = () => {
    this.setState({ isSelected: !this.state.isSelected });
  }

  render() {
    const tintColor = 'white'; // this.state.isSelected ? '#489AF0' : 'gray';
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="transparent"
        activeOpacity={0.5}
        onPress={this.onPress}
      >
        <Image
          style={[styles.star, { tintColor }]}
          source={this.state.isSelected ? images.starFilled : images.star}
        />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 25,
    // backgroundColor: 'yellow',
  },
  star: {
    flex: 1,
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
});
