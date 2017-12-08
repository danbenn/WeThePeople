import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default class BillProgressItem extends Component {
  render() {
    return (
      <View style={styles.progressItem}>
        <Image
          style={[styles.progressImage,
                    {
                      tintColor: this.props.color,
                      borderColor: this.props.color,
                    }]}
        />
        <Text style={[styles.progressItemText, { color: this.props.color }]}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressItem: {
    height: 130,
    // backgroundColor: 'green',
    alignItems: 'center',
  },
  progressImage: {
    height: 12,
    width: 12,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    resizeMode: 'contain',
    // backgroundColor: 'blue',
  },
  progressItemText: {
    // backgroundColor: 'purple',
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 13,
    height: 40,
    width: 80,
  },
});
