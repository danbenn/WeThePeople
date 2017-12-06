import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import CongressAPI from './CongressAPI';
import call from 'react-native-phone-call';

export default class ProfilePage extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'white'
    },
    gesturesEnabled: true,
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      name: '',
      imageUrl: 'https://media.giphy.com/media/KKlNU6e4dWCGY/source.gif',
      party: '',
      state: '',
      title: '',
      bio: '',
    };

    // If this is being clicked from the newsfeed/bill detail
    // there is further fetching that needs to be done
    // Otherwise, we are expecting this to be navigated to from the
    // MyReps page
    if (params.fromBill) {
      CongressAPI.getLegislator(params.legId)
      .then((response) => {
        this.setState({
          firstName: response.first_name,
          lastName: response.last_name,
          name: `${response.first_name} ${response.last_name}`,
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: response.current_party,
          title: response.roles[0].title,
          fromBill: params.fromBill,
        });
      }).then(() => {
        this.fetchBio();
      });
    }
    else {
      var person = params.person;

      var channels = person.channels;
      var imageUrl = 'https://media.giphy.com/media/KKlNU6e4dWCGY/source.gif';
      for (const i in channels) {
        const channel = channels[i];
        if (channel.type == 'Facebook') {
          imageUrl = `https://graph.facebook.com/${channel.id}/picture?type=large`;
          break;
        }
      }

      var nameArray = person.name.split(" ");
      var lastName = nameArray[nameArray.length - 1];
      var firstName = nameArray[0];

      var addressDict = person.address[0];
      var addressArray = [];
      var line1 = addressDict['line1'];
      for (var key in addressDict) {
          if (addressDict.hasOwnProperty(key) && key != 'line1') {
              addressArray.push(addressDict[key]);
          }
      }
      var line2 = addressArray.join(", ");
      var address = [line1, line2].join("\n");

      this.state = {
        name: person.name,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
        party: person.party,
        title: person.position,
        bio: '',
        address: address,
        phone: person.phones[0],
        fromBill: params.fromBill,
      };
      this.fetchBio();
    }
  }

  fetchBio = () => {
    url = 'https://en.wikipedia.org/w/api.php?format=json&action=query' +
           '&prop=extracts&exintro=&explaintext=&titles=' +
           `${this.state.firstName}%20${this.state.lastName}`;
    alternateUrl = url + '%20(politician)';
    bioMessage = 'No bio results, please report to developers';

    fetch(url).then(response => response.json()).then((urlResponse) => {
      // Check if search returned any results
      if (this.wikiSearchHasResults(urlResponse)) {
        extract = this.getExtractFromWikiResponse(urlResponse);
        if (extract == 'multiple') {
          // Try alternateUrl
          fetch(alternateUrl).then(response => response.json()).then((alternateUrlResponse) => {
            if (this.wikiSearchHasResults(alternateUrlResponse)) {
              extract = this.getExtractFromWikiResponse(alternateUrlResponse);

              if (extract == 'multiple') {
                bioMessage = 'Multiple Bio results after alternate attempt, please report to developers';
              }
              else {
                if (extract != "") {
                  bioMessage = extract;
                }
              }
              this.setState({
                bio: bioMessage
              });
            }
          });
        }
        else {
          if (extract != "") {
            bioMessage = extract;
          }
        }
      }
      this.setState({
        bio: bioMessage
      });
    });
    this.setState({
      bio: bioMessage
    });
  }

  wikiSearchHasResults = (response) => {
    return !response.query.pages.hasOwnProperty('-1');
  }

  getExtractFromWikiResponse = (response) => {
    const pages = response.query.pages;

    returnExtract = 'Error fetching bio, please report to developers';

    // only one key in "pages"
    for (const key in pages) {
      if (pages.hasOwnProperty(key)) {
        // grab extract from pages dict
        const { extract } = pages[key];

        if (extract.includes('may refer to')) {
          returnExtract = 'multiple';
          break;
        }

        returnExtract = this.shortenBio(extract)
        break;
      }
    }

    return returnExtract;
  }

  shortenBio = (bio) => {
    let shortBio = bio;
    if (bio.includes('born')) {
      // Removes birthday
      shortBio = bio.replace(/ *\([^)]*\) */g, ' ');
    }
    return shortBio;
  }

  renderBadge = (text, label) => (
    <View style={styles.expView}>
      <Text style={styles.experience}>
        {text}
      </Text>
      <View style={styles.expLabelView}>
        <Text style={styles.expLabel}>
          {label}
        </Text>
      </View>
    </View>
  )

  contactInfo = (fromBill) => {
    if (fromBill == false) {
      return (
        <View style={styles.contactContainer}>
          <Text style={styles.contactInfoHeader}>
            Contact Info
          </Text>
          <Text style={styles.contactInfoTitle}>
            Phone Number
          </Text>
          <Button
            style={styles.contactInfo}
            title={this.state.phone}
            onPress={() => {
              var phoneNumber = this.state.phone;
              phoneNumber = phoneNumber.replace('-', '');
              phoneNumber = phoneNumber.replace('(', '');
              phoneNumber = phoneNumber.replace(')', '');
              phoneNumber = phoneNumber.replace(' ', '');

              const args = {
                number: phoneNumber,
                prompt: true // Determines if the user should be prompt prior to the call
              };

              call(args).catch(console.error);
            }}
          />
          <Text style={styles.contactInfoTitle}>
            Address
          </Text>
          <Text style={styles.contactInfo}>
            {this.state.address}
          </Text>
        </View>
      );
    }
    return (<Text></Text>);
  }

  render() {
    return (
      <ScrollView
        style={styles.backgroundView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardView}>
          <View style={styles.nameView}>
            <Image
              style={styles.profilePic}
              source={{ uri: this.state.imageUrl }}
              thumbnail={require('../images/hamsterOnWheel.gif')}
            />
          </View>
          <Text style={styles.name}>
            {this.state.name}
          </Text>
          <Text style={styles.title}>
            {this.state.title}
          </Text>
          {this.contactInfo(this.state.fromBill)}
          <Text style={styles.bio}>
            {this.state.bio}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  cardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    margin: 9,
    marginTop: 15,
    overflow: 'visible',
  },
  name: {
    flex: 2,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Semibold',
    textAlign: 'center',
    fontSize: 27,
    marginBottom: 5,
  },
  nameView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: 'gray',
  },
  profilePic: {
    flex: 5,
    height: 150,
    width: 150,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 75,
    borderColor: 'gray',
    // backgroundColor: 'gray',
    borderWidth: 2,
  },
  stats: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  expView: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 32.5,
    borderWidth: 1,
    height: 65,
    width: 65,
    borderColor: 'gray',
  },
  expLabel: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  expLabelView: {
    height: 20,
    width: 60,
    borderRadius: 9,
    marginBottom: -6,
    backgroundColor: 'gray',
  },
  experience: {
    flex: 1,
    borderRadius: 32.5,
    height: 65,
    width: 65,
    color: 'gray',
    textAlign: 'center',
    marginTop: 12,
    backgroundColor: 'transparent',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 25,
  },
  bio: {
    marginLeft: 15,
    marginRight: 15,
    margin: 15,
    fontFamily: 'OpenSans-Regular',
    fontSize: 17,
  },
  contactContainer: {
    borderWidth: 2,
    borderColor: 'gray',
    marginLeft: 15,
    marginRight: 15,
  },
  contactInfoHeader: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    marginLeft: 15,
  },
  contactInfoTitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    marginLeft: 15,
  },
  contactInfo: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    textAlign: 'center',
    color: 'gray',
    marginLeft: 15,
  },
  gradientView: {
    flex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
    margin: 9,
    marginTop: 0,
  },
  gradient: {
    flex: 1,
    height: 15,
    width: (Dimensions.get('window').width) - 36,
    marginLeft: 9,
    marginRight: 9,
    marginTop: 9,
  },
  ideologyLabelView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginTop: 5,
  },
  ideologyLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: 'gray',
  },
  ideologyIndicator: {
    height: 30,
    width: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'magenta',
    marginTop: -7,
    marginLeft: 300,
  },
});
