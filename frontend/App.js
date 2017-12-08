/* @flow */

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import firebase from 'react-native-firebase';
import Onboarding from './app/components/Onboarding';
import PhoneAuth from './app/components/PhoneAuth';
import BillDetail from './app/components/BillDetail';
import ProfilePage from './app/components/ProfilePage';
import TabView from './app/components/TabView';
import PrivacyPolicy from './app/components/PrivacyPolicy';

export default class App extends Component {
  constructor(props) {
    super(props);
    // To temporarily disable warnings, uncomment this line:
    console.disableYellowBox = true;
    this.state = {
      userIsFetched: false,
      userIsLoggedIn: false,
    };
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        userIsFetched: true,
        userIsLoggedIn: (user != null),
      });
    });
  }

  render() {
    // To sign out of Firebase, uncomment this line:
    // firebase.auth().signOut();
    if (this.state.userIsFetched && this.state.userIsLoggedIn) {
      return (
        <LoggedInUserNavigator />
      );
    }
    if (this.state.userIsFetched && !this.state.userIsLoggedIn) {
      return (
        <FirstTimeUserNavigator />
      );
    }
    return (<View />);
  }
}

const FirstTimeUserNavigator = StackNavigator({
  Onboarding: { screen: Onboarding, navigationOptions: { header: null } },
  PhoneAuth: { screen: PhoneAuth, navigationOptions: { header: null } },
  TabView: { screen: TabView, navigationOptions: { header: null } },
  BillDetail: { screen: BillDetail },
  ProfilePage: { screen: ProfilePage },
  PrivacyPolicy: { screen: PrivacyPolicy },
});

const LoggedInUserNavigator = StackNavigator({
  TabView: { screen: TabView, navigationOptions: { header: null } },
  BillDetail: { screen: BillDetail },
  ProfilePage: { screen: ProfilePage },
  PrivacyPolicy: { screen: PrivacyPolicy },
});
