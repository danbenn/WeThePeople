import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ListView,
  AsyncStorage,
} from 'react-native';
import PropTypes from 'prop-types';

import CivicAPI from './CivicAPI';
import MyRepsCell from './MyRepsCell';
import LoadingScreen from './LoadingScreen';
import AddressEntry from './AddressEntry';
import { NavigationActions } from 'react-navigation';

export default class MyReps extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.resetAddress = this.resetAddress.bind(this);
    this.state = {
      voterAddress: 'None',
      viewStatement: 'your representatives',
    };

    let address = this.state.voterAddress;
    AsyncStorage.getItem('voterAddress').then((value) => {
      if (value != null) {
        address = value;
        CivicAPI.getRepresentatives(address).then(response => this.parseReps(response, address, false));
      }
    });

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { true; } });
    this.state = {
      voterAddress: address,
      dataSource: ds.cloneWithRows([]),
      fetched: false,
      viewStatement: 'your representatives',
    };
  }

  render() {
    if (this.state.voterAddress == 'None') {
      return (
        <AddressEntry
          prevComponent={this}
        />
      );
    }

    if (this.state.fetched == false) {
      return (
        <LoadingScreen />
      );
    }

    const Header = (props) => (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
          {this.state.voterAddress}
          </Text>
          <Button title="Change address" onPress={this.resetAddress} />
        </View>
      </View>
    );

    return (
      <ListView
        style={styles.backgroundView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections
        renderHeader={() => <Header />}
      />
    );
  }

  resetAddress() {
    this.setState({
      voterAddress: 'None',
    });
  }

  renderRow(rowData) {
    return (
      <View>
        <MyRepsCell
          person={rowData}
          personWasTapped={this.props.personWasTapped}
        />
      </View>
    );
  }

  updateAddress(address) {
    // Set permanently
    AsyncStorage.setItem('voterAddress', address);
    const parser = require('parse-address');
    const parsedState = parser.parseLocation(address).state;
    console.log('voterState: ', parsedState);
    AsyncStorage.setItem('voterState', parsedState);

    // Fetch representatives
    CivicAPI.getRepresentatives(address).then((response) => {
      this.parseReps(response, address, true);
    });
  }

  parseReps(response, address, goBack) {
    // Match politicians with their offices
    const reps = response.officials;
    if (reps !== undefined) {
      const positions = [];
      const offices = response.offices;
      for (const i in offices) {
        const office = offices[i];
        const officeName = office.name.replace(/(Senate)/g, 'Senator');
        for (const j in office.officialIndices) {
          const index = office.officialIndices[j];
          reps[index].position = officeName;
        }
      }
      const repsWithoutPresident = reps.filter(rep => this.isNotPresident(rep));

      this.setState(
        {
          dataSource: this.state.dataSource.cloneWithRows(repsWithoutPresident),
          fetched: true,
          viewStatement: 'your representatives',
          voterAddress: address,
        },
        () => {
          if (goBack) {
            const backAction = NavigationActions.back({
              key: 'AddressEntry',
            });
            // this.props.navigation.dispatch(backAction);
          }
        },
      );
    }
  }

  isNotPresident(rep) {
    return !rep.position.includes('President of the United States');
  }

  bindFunctions() {
    this.parseReps = this.parseReps.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }
}

MyReps.propTypes = {
  personWasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
  header: {
    flex: 1,
    marginTop: 7,
    backgroundColor: 'white',
    alignSelf: "stretch",
    marginLeft: 7,
    marginRight: 7,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#CFD8DC',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    backgroundColor: 'white',
    color: 'black',
  },
  description: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 20,
    marginBottom: 0,
    backgroundColor: 'white',
  },
});
