import React, { Component } from 'react';
import {
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import PageControl from 'react-native-page-control';
import images from '../assets/images';

const PAGE_WIDTH = Dimensions.get('window').width;

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.continueWasTapped = this.continueWasTapped.bind(this);
  }

  state = {
    scroll: new Animated.Value(0),
    page: 0,
    pages: [
      {
        title: 'Make a difference. \nOne bill at a time.',
        backgroundColor: '#0264BC',
        image: images.globe,
      },
      {
        title: 'Vote on real bills.\nYou\'re in charge.',
        backgroundColor: '#1abc9c',
        image: images.clipboard,
      },
      {
        title: 'Contact your reps\non issues that matter.',
        backgroundColor: '#d35400',
        image: images.oldPhone,
      },
    ],
  };

  continueWasTapped = () => {
    const { navigate } = this.props.navigation;
    navigate('PhoneAuth');
  }

  privacyPolicyWasTapped = () => {
    const { navigate } = this.props.navigation;
    navigate('PrivacyPolicy');
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={(event) => {
            this.setState({ page: event.nativeEvent.contentOffset.x / PAGE_WIDTH });
          }
        }
        >
          {this.state.pages.map((page, i) => (
            <View
              style={styles.card}
              key={i}
            >
              <Text style={styles.title}>
                {page.title}
              </Text>
              <Image
                source={page.image}
                style={styles.photo}
              />
            </View>
          ))}
        </Animated.ScrollView>
        <PageControl
          style={styles.pageControl}
          numberOfPages={this.state.pages.length}
          currentPage={this.state.page}
          pageIndicatorTintColor="white"
          currentPageIndicatorTintColor="white" // "#489AF0"
        />

        <TouchableHighlight
          style={styles.button}
          underlayColor="#489AF0"
          activeOpacity={0.5}
          onPress={this.continueWasTapped}
        >
          <View>
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.privacyPolicy}
          underlayColor="white"
          activeOpacity={0.5}
          onPress={this.privacyPolicyWasTapped}
        >
          <View>
            <Text style={styles.privacyPolicyText}>
              {'Privacy policy'}
            </Text>
          </View>
        </TouchableHighlight>

      </View>
    );
  }
}

Onboarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
    backgroundColor: 'white',
  },
  title: {
    flex: 3,
    marginTop: 30,
    fontSize: PAGE_WIDTH / 15,
    fontFamily: 'OpenSans-Light',
    lineHeight: 35,
    color: '#000000',
    textAlign: 'center',
    // backgroundColor: 'orange'
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: PAGE_WIDTH,
    marginTop: 50,
    // backgroundColor: 'magenta',
  },
  button: {
    flex: 1,
    backgroundColor: '#489AF0',
    position: 'absolute',
    marginTop: 35,
    borderRadius: 30,
    alignItems: 'center',
    bottom: 50,
    margin: 20,
    width: PAGE_WIDTH - 40,
    marginBottom: 10,
    // backgroundColor: 'purple'
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    margin: 12,
    color: 'white',
  },
  privacyPolicy: {
    margin: 8,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 22,
    // backgroundColor: 'purple',
  },
  pageControl: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 135,
  },
  privacyPolicyText: {
    color: '#929292',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'white',
  },
  photo: {
    flex: 4,
    resizeMode: 'contain',
    width: PAGE_WIDTH / 1.8,
    height: PAGE_WIDTH / 1.8,
    // backgroundColor: 'green',
    marginBottom: 190,
  },
});
