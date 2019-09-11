import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      QR_Code_Value: '',
      Start_Scanner: false,
      Loading:false,
    };
  }
  onQR_Code_Scan_Done = (QR_Code) => {
    this.setState({ QR_Code_Value: QR_Code,Start_Scanner: false, Loading:true });
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: QR_Code
      }),
    }).then(res => res.json())
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          this.setState({Loading:false});
        })
        .catch(error => {
          alert(error);
          this.setState({Loading:false});
        });
  };
  open_QR_Code_Scanner=()=> {
    let that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA, {
                'title': 'Camera App Permission',
                'message': 'Camera App needs access to your camera '
              }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({ QR_Code_Value: '', Start_Scanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      that.setState({ QR_Code_Value: '', Start_Scanner: true});
    }
  };
  render() {
    if (!this.state.Start_Scanner) {
      return (
          <View style={styles.MainContainer}>
            <Text style={{ fontSize: 22, textAlign: 'center' }}>DEVFEST QR Kod Okuyucu</Text>
            {this.state.Loading?
                <ActivityIndicator size="large" color="#0000ff" />:
                <View>
                  <Text style={styles.QR_text}>
                    {this.state.QR_Code_Value ? 'Scanned QR Code: ' + this.state.QR_Code_Value : ''}
                  </Text>
                  <TouchableOpacity
                      onPress={this.open_QR_Code_Scanner}
                      style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 14 }}>
                      Tara
                    </Text>
                  </TouchableOpacity>
                </View>
            }
          </View>
      );
    }
    return (
        <View style={{ flex: 1 }}>
          <CameraKitCameraScreen
              showFrame={true}
              scanBarcode={true}
              laserColor={'#FF3D00'}
              frameColor={'#00C853'}
              colorForScannerFrame={'black'}
              onReadCode={event =>
                  this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
              }
          />
        </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  button: {
    backgroundColor: '#2979FF',
    alignItems: 'center',
    padding: 12,
    width: 300,
    marginTop: 14
  },
});
