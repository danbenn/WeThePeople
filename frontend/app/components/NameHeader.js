import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  AppRegistry,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import ProfilePic from './ProfilePic';
import FavoriteButton from './FavoriteButton';

const PAGE_WIDTH = Dimensions.get('window').width;
const moment = require('moment');

export default class NameHeader extends Component {
  constructor(props) {
    super(props);
    const { bill } = this.props;
    const sponsorName = `${bill.sponsor.first_name} ${bill.sponsor.last_name}`;
    const fbId = bill.sponsor.facebook_id;
    const imageUrl = `https://graph.facebook.com/${fbId}/picture?type=large`;
    const { actions } = this.props.bill;
    const lastActionDate = actions[actions.length - 1].date;
    const date = moment(lastActionDate, 'YYYY-MM-DD').startOf('day').fromNow();
    const party = ` (${bill.sponsor.party}-${bill.sponsor.state})`;
    const sponsorId = bill.sponsor.id;
    this.state = {
      sponsorName,
      fbId,
      imageUrl,
      date,
      party,
      sponsorId,
    };
  }

  render() {
    const id = this.state.sponsorId;
    return (
      <View style={[styles.header, this.props.style]}>
        <ProfilePic
          imageUrl={this.state.imageUrl}
          wasTapped={() => this.props.wasTapped({
            legId: this.state.sponsorId,
            fromBill: true,
          })}
        />
        <View style={styles.nameView}>
          <View>
            <TouchableHighlight
              style={styles.sponsorWrapper}
              underlayColor="white"
              onPress={() => this.props.wasTapped({
                legId: this.state.sponsorId,
                fromBill: true,
              })}
            >
              <Text>
                <Text style={styles.sponsor}>
                  {this.state.sponsorName}
                </Text>
                <Text style={styles.party}>
                  {this.state.party}
                </Text>
              </Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.date}>
            {this.state.date}
          </Text>
        </View>
        <FavoriteButton />
      </View>
    );
  }
}

NameHeader.propTypes = {
  bill: PropTypes.object.isRequired,
  wasTapped: PropTypes.func.isRequired,
};

let styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'white',
    // backgroundColor: 'green'
    // backgroundColor: '#FF6F00',
  },
  date: {
    marginTop: 8,
    marginLeft: 10,
    fontSize: 14,
    color: 'grey',
  },
  nameView: {
    width: PAGE_WIDTH - 10 - 10 - 60 - 50 - 10 - 10,
    flexDirection: 'column',
    // backgroundColor: 'magenta',
  },
  sponsorWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    // backgroundColor: 'yellow',
  },
  sponsor: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: 'black',
  },
  party: {
    fontSize: 18,
    fontFamily: 'OpenSans-Light',
    color: 'black',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'gray',
  },

});


AppRegistry.registerComponent('ProfilePic', () => ProfilePic);
