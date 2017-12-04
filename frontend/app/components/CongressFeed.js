import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  AsyncStorage,
} from 'react-native';
import PropTypes from 'prop-types';

import BillCell from './BillCell';
import LoadingScreen from './LoadingScreen';
import sampleBill from '../assets/sampleWeThePeopleBill.json';
import CongressAPI from './CongressAPI';

export default class CongressFeed extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    let voterState = '';
    AsyncStorage.getItem('voterState').then((value) => {
      if (value != null) {
        voterState = value;
        CongressAPI.getRecentBills(voterState).then(response => this.parseBills(response));
      } else {
        CongressAPI.getRecentBills('mi').then(response => this.parseBills(response));
      }
    });


    this.state = {
      dataSource: ds.cloneWithRows([]),
      fetched: false,
    };
  }

  renderRow(rowData) {
    return (
      <View>
        <BillCell
          bill={rowData}
          billWasTapped={this.props.billWasTapped}
          personWasTapped={this.props.personWasTapped}
        />
      </View>
    );
  }

  render() {
    if (!this.state.fetched) {
      return (
        <LoadingScreen />
      );
    }
    return (
      <ListView
        style={styles.backgroundView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections
      />
    );
  }

  parseBills(response) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(response),
      fetched: true,
    });
  }
}

CongressFeed.propTypes = {
  billWasTapped: PropTypes.func.isRequired,
  personWasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
  floatingButton: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
});
