/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ART,
  Dimensions
} from 'react-native';
import {
  AnimPath,
  AnimShape
 } from 'art-anim-shape';
 const { width, height } = Dimensions.get('window');
 let p = AnimPath().moveTo(100, 100)
                        .lineTo(100, 300)
                        .lineTo(300, 300)
                        .lineTo(250, 250)
                        .lineTo(210, 50)
                        .lineTo(20, 40)
                        .close().getPointsArray();
export default class M extends Component {
  render() {
    return (
      <View style={styles.container}>
      <ART.Surface width={width} height={height} >
       <AnimShape path={p}  time= {3000} stroke='blue' strokeWidth={4}/>
 
       <AnimShape 
       path={
        AnimPath().moveTo(204, 140)
        .lineTo(104, 230)
        .lineTo(204, 130)
        .lineTo(20, 250)
        .lineTo(210, 130)
        .lineTo(224, 40)
        .close().getPointsArray()
     }  
     time= {3000} stroke='red' strokeWidth={4}/>
     </ART.Surface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('M', () => M);
