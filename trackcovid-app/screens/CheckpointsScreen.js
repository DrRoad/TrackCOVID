import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Button, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import { BarCodeScanner } from 'expo-barcode-scanner'
import API from '../api'
import { StatusContext } from '../status-context'
import StatusBanner from '../components/status-banner'

const {
  checkpointKeyLength
} = require('covidwatch-js/config')

const initialState = {
  mode: 'home',
  checkpointKey: null,
  checkpointTime: null,
  hasPermission: null,
  scanned: false,
  joinError: false
}

class CheckpointsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = initialState
  }

  async reset () {
    this.setState(initialState)
  }

  async endHost () {
    Alert.alert(
      'End this checkpoint?',
      'Once the checkpoint is ended, no one else will be able to join.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        { text: 'Yes, end', onPress: () => this.reset() }
      ],
      { cancelable: false }
    )
  }

  async becomeHost () {
    try {
      const { key, time } = await API.hostCheckpoint()
      this.setState({
        mode: 'host',
        checkpointKey: key,
        checkpointTime: time
      })
    } catch (e) {
      console.log(e)
      Alert.alert('An unknown error occurred.')
    }
  }

  async joinCheckpoint () {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    this.setState({
      hasPermission: status === 'granted',
      mode: 'join'
    })
  }

  async handleBarCodeScanned ({ type, data }) {
    if (data && (data.length === checkpointKeyLength)) {
      try {
        await API.joinCheckpoint(data)
        this.setState({ scanned: true })
      } catch (e) {
        console.log(e)
        this.setState({ scanned: true, joinError: true })
      }
    } else {
      // QR code may be a url
      const urlSplit = data.split('?checkpoint=')
      if ((urlSplit.length === 2) && (urlSplit[1].length === checkpointKeyLength)) {
        try {
          await API.joinCheckpoint(urlSplit[1])
          this.setState({ scanned: true })
        } catch (e) {
          console.log(e)
          this.setState({ scanned: true, joinError: true })
        }
      } else {
        this.setState({ scanned: true, joinError: true })
      }
    }
  }

  render () {
    const { mode, checkpointKey, checkpointTime, hasPermission, scanned, joinError } = this.state
    if (mode === 'home') {
      return (
        <View style={styles.container}>
          <StatusBanner />
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.getStartedContainer}>
              <Button title='Host a checkpoint' onPress={this.becomeHost.bind(this)} />
              <Text style={styles.getStartedText}>
                OR
              </Text>
              <Button title='Join a checkpoint' onPress={this.joinCheckpoint.bind(this)} />
            </View>
          </ScrollView>
        </View>
      )
    } else if (mode === 'host') {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.container2}>
              <Text style={{ marginBottom: 20 }}>
                You are now hosting a checkpoint. Others may check in by using the QR code below.
              </Text>
              <QRCode value={checkpointKey} size={250} />
              <Text style={styles.getStartedText}>
                Checkpoint created {new Date(checkpointTime).toDateString()}
              </Text>
              <Button title='End checkpoint' onPress={this.endHost.bind(this)} />
            </View>
          </ScrollView>
        </View>
      )
    } else if (mode === 'join' && !scanned) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <BarCodeScanner
            onBarCodeScanned={this.handleBarCodeScanned.bind(this)}
            style={StyleSheet.absoluteFillObject}
          />
          <Button title='Cancel' onPress={this.reset.bind(this)} />
        </View>
      )
    } else if (mode === 'join') {
      let responseText = 'You have checked in successfully'
      if (hasPermission === null) {
        responseText = 'Requesting camera permission'
      } else if (hasPermission === false) {
        responseText = 'No access to camera'
      } else if (joinError) {
        responseText = 'The QR code could not be read. Please try again.'
      }
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.getStartedContainer}>
              <Text style={styles.getStartedText}>
                {responseText}
              </Text>
              <Button title='Done' onPress={this.reset.bind(this)} />
            </View>
          </ScrollView>
        </View>
      )
    }
  }
}

CheckpointsScreen.contextType = StatusContext

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  container2: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  getStartedContainer: {
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  }
})

export default CheckpointsScreen
