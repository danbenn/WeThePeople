import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Dimensions,
  NativeModules,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import firebase from 'react-native-firebase';

/*
 * Heavily adapted from @niftylettuce 's code:
 * https://github.com/joinspontaneous/react-native-phone-verification/
 */

const MAX_LENGTH_CODE = 6;
const PAGE_WIDTH = Dimensions.get('window').width;


const brandColor = '#489AF0';

export default class PhoneAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterCode: false,
      spinner: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  onChangeText = (val) => {
    if (!this.state.enterCode) return;
    if (val.length === MAX_LENGTH_CODE) { this.verifyCode(); }
  }

  getCode = () => {
    this.setState({ spinner: true });
    const phoneNumber = `+1${this.refs.form.getValues().phoneNumber}`;
    setTimeout(async () => {
      try {
        this.refs.form.refs.textInput.setNativeProps({ text: '' });
        const confirmResult = await firebase.auth().signInWithPhoneNumber(phoneNumber);
        this.setState({
          spinner: false,
          enterCode: true,
        });
        this.setState({ confirmResult, message: 'Code has been sent!' });
        setTimeout(() => {
          Alert.alert('Sent!', "We've sent you a verification code", [{
            text: 'OK',
            onPress: () => this.refs.form.refs.textInput.focus(),
          }]);
        }, 100);
      } catch (err) {
        this.setState({ spinner: false });
        setTimeout(() => {
          Alert.alert('Oops!', err.message);
        }, 100);
      }
    }, 100);
  }

  getSubmitAction = () => (this.state.enterCode ? this.verifyCode() : this.getCode())

  tryAgain = () => {
    this.refs.form.refs.textInput.setNativeProps({ text: '' });
    this.refs.form.refs.textInput.focus();
    this.setState({ enterCode: false });
  }

  navigateToBubblePicker = () => {
    NativeModules.DismissViewControllerManager.goBack();
  }

  verifyCode = () => {
    this.setState({ spinner: true });
    setTimeout(async () => {
      try {
        const { code } = this.refs.form.getValues();
        const { confirmResult } = this.state;

        if (confirmResult && code.length) {
          const user = await confirmResult.confirm(code);

          this.setState({ message: 'Code Confirmed!' });

          // this.refs.form.refs.textInput.blur();
          this.setState({ spinner: false });
          setTimeout(() => {
            Alert.alert('Success!', 'You have successfully verified your phone number');
          }, 100);
          this.navigateToBubblePicker();
          this.props.navigation.navigate('TabView');
        }
      } catch (err) {
        this.setState({ spinner: false });
        setTimeout(() => {
          Alert.alert('Oops!', err.message);
        }, 100);
      }
    }, 100);
  }

  renderFooter = () => {
    if (this.state.enterCode) {
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this.tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      );
    }
    return (
      <View>
        <Text style={styles.disclaimerText}>
          {'By tapping "Send confirmation code" above, we will send \
            you an SMS to confirm your phone number. Message & \
            data rates may apply.'}
        </Text>
      </View>
    );
  }

  render() {
    const headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`;
    const buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    const textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier',
    } : {};
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Form ref="form" style={styles.form}>
            <Text style={styles.header}>{headerText}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                ref="textInput"
                name={this.state.enterCode ? 'code' : 'phoneNumber'}
                type="TextInput"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={this.onChangeText}
                placeholder={this.state.enterCode ? '_ _ _ _ _ _' : ''}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                style={[styles.textInput, textStyle]}
                returnKeyType="go"
                autoFocus
                placeholderTextColor={brandColor}
                selectionColor={brandColor}
                maxLength={this.state.enterCode ? 6 : 20}
                onSubmitEditing={this.getSubmitAction}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={this.getSubmitAction}>
              <Text style={styles.buttonText}>{ buttonText }</Text>
            </TouchableOpacity>
          </Form>
          {this.renderFooter()}
          <View style={{ flex: 1 }} />
          <Spinner
            visible={this.state.spinner}
            textContent="One moment..."
            textStyle={{ color: '#fff' }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: PAGE_WIDTH / 15,
    color: '#4A4A4A',
    fontFamily: 'OpenSans-Light',
    // backgroundColor: 'orange',
  },
  form: {
    flex: 1.2,
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    // backgroundColor: 'cyan',
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 40,
    color: brandColor,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    // backgroundColor: 'blue'
  },
  button: {
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  disclaimerText: {
    margin: 20,
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    // backgroundColor: 'green'
  },
});
