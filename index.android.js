'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,
  PixelRatio,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Camera from 'react-native-camera';
import { Router, Scene, Actions, } from 'react-native-router-flux';
export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="pageOne" component={Controll} title="Sellect Avatar" initial={true} />
          <Scene key="pageTwo" component={TakingPhoto} hideNavBar={true}  />
        </Scene>
      </Router>

    )
  }
}
class Controll extends Component {
  state = {
    avatarSource: null,
    videoSource: null
  };
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source = { uri: response.uri };

          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };

          this.setState({
            avatarSource: source
          });
        }
      });
    }
  render(){
    return(
        <View style={styles.containers}>
        <Text style={{ fontSize:30,borderRadius:10,  borderWidth: 10 / PixelRatio.get(),borderColor:'#ee02f2',color:'white', marginLeft:0,marginBottom:20,textAlign:'center', backgroundColor:'#192c3a'}} onPress={Actions.pageTwo}>Take a Photo</Text>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatarSource === null ? <Text style={{fontSize:15, color:'#2f3238', fontWeight:'bold'}}>{'Sellect a photo'.toUpperCase()}</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
            </View>
          </TouchableOpacity>
        </View>

    );
  }
}
class TakingPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType : 'back',
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          type={this.state.cameraType}>
          <Text style={styles.turn} onPress={this.turnCamera.bind(this)}>[TURN]</Text>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
  turnCamera(){
    if(this.state.cameraType === 'back') {
        this.setState({
          cameraType : 'front',
          mirror : true
        })
      }
      else {
        this.setState({
          cameraType : 'back',
          mirror : false
        })
      }
    }
  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  containers:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d6e3fc'
  },
  avatarContainer: {
    borderColor: 'red',
    borderWidth: 20 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  turn:{
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 440,
  }
});

AppRegistry.registerComponent('TakingPhoto', () => App);
