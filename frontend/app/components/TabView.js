/* @flow */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import PropTypes from 'prop-types';
import CongressFeed from './CongressFeed';
import BillSwiper from './BillSwiper';
import MyReps from './MyReps';
import AccountTab from './AccountTab';
import images from '../assets/images';

export default class TabView extends PureComponent {
  state = {
    index: 1,
    routes: [
      // { key: '1', image: images.profile },
      // { key: '2', image: images.bolt },
      { key: '3', image: images.newspaper },
      { key: '4', image: images.location },
      // { key: '5', image: images.notification },
    ],
  };

  handleIndexChange = (index) => {
    this.setState({
      index,
    });
  }

  billWasTapped = (bill) => {
    const { navigate } = this.props.navigation;
    navigate('BillDetail', {
      bill,
      personWasTapped: this.personWasTapped,
    });
  }

  personWasTapped = (legId) => {
    const { navigate } = this.props.navigation;
    navigate('ProfilePage', { legId });
  }

  renderIcon = ({ route }) => (
    <Image
      source={route.image}
      style={styles.tabIcon}
    />
  )

  renderHeader = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      renderIcon={this.renderIcon}
      style={styles.tabbar}
    />
  );

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <AccountTab />
        );
      case '2':
        return (
          <BillSwiper
            billWasTapped={this.billWasTapped}
            personWasTapped={this.personWasTapped}
          />
        );
      case '3':
        return (
          <CongressFeed
            billWasTapped={this.billWasTapped}
            personWasTapped={this.personWasTapped}
          />
        );
      case '4':
        return (
          <MyReps />
        );
      case '5':
        return (
          <CongressFeed
            billWasTapped={this.billWasTapped}
            personWasTapped={this.personWasTapped}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onIndexChange={this.handleIndexChange}
        swipeEnabled={this.state.index !== 1}
      />
    );
  }
}

TabView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
  tabbar: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: 'gray',
  },
  tabIcon: {
    height: 30,
    width: 30,
    tintColor: '#656572',
  },
});
