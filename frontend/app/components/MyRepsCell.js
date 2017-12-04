import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  ListView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

import CivicAPI from './CivicAPI';

export default class MyRepsCell extends Component {
  componentWillMount() {
    const person = this.props.person;

    let imageUrl;

    if (person.channels != undefined) {
      const channels = person.channels.filter(channel => (channel.type === 'Facebook'));
      if (channels.length != 0) {
        imageUrl = `https://graph.facebook.com/${
          channels[0].id}/picture?type=large`;
      }
    }

    const firstName = person.name.split(' ')[0];
    const lastName = person.name.split(' ').pop();
    const position = person.position;
    let party = '';
    if (person.party != undefined && person.party != 'Unknown') {
      party = ` (${person.party[0]})`;
    }

    const displayName = `${firstName} ${lastName}`; // + ' (' + party + ')';
    const initials = firstName[0] + lastName[0];

    let initialsColor = 'transparent';
    if (imageUrl === undefined) {
      initialsColor = 'white';
    }

    this.setState({
      name: displayName,
      imageUrl,
      initials,
      initialsColor,
      position,
      party,
    });
  }

  render() {
    const imageBorderRadius = ((Dimensions.get('window').width * 0.4) - 7) / 2;
    return (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.props.personWasTapped({
          person: this.props.person,
          fromBill: false,
        })}
      >
        <View style={styles.backgroundView}>
          <ImageBackground
            borderRadius={imageBorderRadius}
            style={styles.profilePic}
            source={{ uri: this.state.imageUrl }}
          >
            <View style={styles.initialsView}>
              <Text style={[styles.initialsText,
                { color: this.state.initialsColor }]}
              >
                {this.state.initials}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.descriptionView}>
            <Text
              style={styles.name}
            >
              <Text>
                {this.state.name}
              </Text>
              <Text style={styles.party}>
                {this.state.party}
              </Text>
            </Text>
            <Text
              style={styles.position}
              adjustsFontSizeToFit
            >
              {this.state.position}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

MyRepsCell.propTypes = {
  personWasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: Dimensions.get('window').width * 0.4,
    // backgroundColor: 'cyan',
    marginTop: 7,
    marginLeft: 7,
  },
  profilePic: {
    height: (Dimensions.get('window').width * 0.4),
    width: (Dimensions.get('window').width * 0.4),
    // backgroundColor: 'gray',
    borderWidth: 0.5,
    marginRight: 7,
    borderColor: 'black',
    borderRadius: ((Dimensions.get('window').width * 0.4) - 7) / 2,
    // resizeMode: 'contain',
  },
  descriptionView: {
    height: 140,
    backgroundColor: 'white',
    height: Dimensions.get('window').width * 0.4,
    width: Dimensions.get('window').width * 0.6 - 21,
    marginRight: 7,
    // backgroundColor: 'yellow',
  },
  name: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    margin: 14,
    marginBottom: 7,

    // backgroundColor: 'yellow',
  },
  position: {
    flex: 1,
    fontSize: 18,
    margin: 14,
    marginTop: 0,
    fontFamily: 'OpenSans-Light',
    marginBottom: 14,

    // backgroundColor: 'cyan',
  },
  initialsView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  initialsText: {
    flex: 1,
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    fontSize: 58,
    fontFamily: 'OpenSans-Light',
    // backgroundColor: 'cyan',
  },
  party: {
    fontFamily: 'OpenSans-Light',
  },

});
