import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import CongressAPI from './CongressAPI';
import NameHeader from './NameHeader';
import We from '../images/We.png';

const moment = require('moment');

export default class BillCell extends Component {
  componentWillMount() {
    this.setState({
      sponsor: '',
      imageUrl: ' ',
      party: '',
      details: this.props.bill.title,
      legId: '',
    });
    const legislatorId = this.props.bill.sponsor.id;
    CongressAPI.getLegislator(legislatorId)
      .then((response) => {
        this.setState({
          sponsor: `${response.first_name} ${response.last_name} `,
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: `(${response.current_party}-${response.roles[0].state})`,
          legId: response.member_id,
        });
      });
  }

  render() {
    const { actions } = this.props.bill;
    const last_action_date = actions[actions.length - 1].date;
    const { last_updated } = this.props.bill;
    const humanized_date = moment(last_updated, 'YYYY-MM-DD').startOf('day').fromNow();
    return (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.props.billWasTapped(this.props.bill)}
      >
        <View style={styles.cardView}>
          <NameHeader
            name={this.state.sponsor}
            imageUrl={this.state.imageUrl}
            party={this.state.party}
            wasTapped={this.props.personWasTapped}
            date={humanized_date}
            legId={this.state.legId}
          />
          <Text style={styles.content} numberOfLines={2}>
            {this.state.details}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

BillCell.propTypes = {
  billWasTapped: PropTypes.func.isRequired,
  personWasTapped: PropTypes.func.isRequired,
};

let styles = StyleSheet.create({
  cardView: {
    height: 140,
    marginRight: 7,
    marginLeft: 7,
    marginTop: 7,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'green'
    // backgroundColor: '#FF6F00',
  },
  content: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    // backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Regular',
  },
  date: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 14,
    color: 'grey',
  },
  nameView: {
    flexDirection: 'column',
    // backgroundColor: 'magenta'
  },
  sponsorWrapper: {
    marginTop: 15,
    marginLeft: 10,
  },
  sponsor: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
  },
  party: {
    fontSize: 18,
    fontFamily: 'OpenSans-Light',
  },
  topic: {
    marginTop: 5,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 16,
    // backgroundColor: 'green',
    textAlign: 'right',
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
