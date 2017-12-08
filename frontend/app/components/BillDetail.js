import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import CongressAPI from './CongressAPI';
import BillProgress from './BillProgress';
import NameHeader from './NameHeader';
import Emoji from './Emoji';
import CustomButton from './CustomButton';
import images from '../assets/images';

export default class BillDetail extends Component {
  static navigationOptions = {
    headerStyle: { backgroundColor: 'white' },
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const { sponsor } = params.bill;
    let imageUrl = '';
    if ('facebook_id' in params.bill.sponsor) {
      const facebookId = params.bill.sponsor.facebook_id;
      imageUrl = `https://graph.facebook.com/${facebookId}/picture?type=large`;
    } else {
      imageUrl = params.bill.sponsor.picture_url;
    }
    this.state = {
      billExcerpts: '',
      sponsor: `${sponsor.first_name} ${sponsor.last_name} `,
      bill: params.bill,
      imageUrl,
      legId: '',
      personWasTapped: params.personWasTapped,
      committees: ['hello'],
    };
  }

  componentWillMount() {
    this.setCommittees();
    const { params } = this.props.navigation.state;
    const legislatorId = params.bill.sponsor.id;
    CongressAPI.getLegislator(legislatorId)
      .then((response) => {
        this.setState({
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: `(${response.current_party}-${response.roles[0].state})`,
          legId: response.member_id,
        });
      });
  }

  setCommittees = () => {
    let committeeNames = new Array(0);
    if (Array.isArray(this.state.bill.senate_committees)) {
      const senate = this.state.bill.senate_committees.map(committeeObj => committeeObj.committee);
      committeeNames += senate;
    }
    if (Array.isArray(this.state.bill.house_committees)) {
      this.state.bill.house_committees.forEach((obj) => {
        committeeNames.push(obj.committee);
      });
    }
    this.setState({ committees: committeeNames });
  }

  renderSummary = () => {
    const humanSummary = this.state.bill.human_summary.join('\n\n');
    const machineSummary = this.state.bill.machine_summary.join('\n\n');
    let textToShowUser = humanSummary;
    if (humanSummary === '') {
      textToShowUser = machineSummary;
    }
    return (
      <Text style={styles.summary}>
        {textToShowUser}
      </Text>
    );
  }

  renderCommittees = () => (
    <View>
      <Text style={styles.summaryHeader}>
        {'Committees'}
      </Text>
      {this.state.committees.map(committee => (
        <Text style={styles.summaryHeader}>
          {committee}
        </Text>
      ))}
    </View>

  )

  render() {
    const details = this.state.bill.title;
    const subject = this.state.bill.topic;
    const date = this.state.bill.introduction_date;
    const relativeDate = this.state.bill.last_updated;
    const { sponsor } = this.state;
    return (
      <ScrollView
        style={styles.backgroundView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <NameHeader
          bill={this.state.bill}
          wasTapped={this.state.personWasTapped}
        />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            {details}
          </Text>
          <BillProgress style={styles.progressView} />
          <Text style={styles.summaryHeader}>
            {'Summary'}
          </Text>
          {this.renderSummary()}
          {this.renderCommittees()}
        </View>
        <View style={styles.divider} />
      </ScrollView>
    );
  }
}


BillDetail.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

let styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: '#CFD8DC',
    flex: 1,
    // backgroundColor: 'magenta',
  },
  scrollViewContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'blue',
  },
  header: {
    marginTop: 7,
  },
  title: {
    flex: -1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 30,
    // backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Regular',
    color: '#1F222A',
  },
  progressView: {
    marginBottom: 100,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // backgroundColor: 'cyan',
  },
  summaryHeader: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 7,
  },
  summary: {
    flex: -1,
    margin: 15,
    marginTop: 21,
    marginBottom: 15,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    lineHeight: 25,
    backgroundColor: 'white',
    // backgroundColor: 'orange',
    textAlign: 'left',
  },
  reactionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 15,
  },
  divider: {
    height: 0.75,
    backgroundColor: '#CFD8DC',
    marginLeft: 15,
    marginRight: 15,
  },
  reactionLabel: {
    flex: 1,
  },

});
