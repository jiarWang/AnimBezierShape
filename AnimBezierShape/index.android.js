/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ART,
  Dimensions
} from 'react-native';

'use strict';
import AnimBezierShape from './src/component/AnimBezierShape';

const { width, height } = Dimensions.get('window');
export default class AnimBezier extends Component {

  render() {
    return (
      <View style={styles.container}>
      <ART.Surface width={width} height={height} >
       <AnimBezierShape path={
          [
            [173, 149 , 48, 264, 274, 156, 82.5, 81],   
            [82, 81, 148, 264, 88, 154, 164, 285],
            [164, 285, 146, 201, 85, 179 , 203 ,273],
            [203, 273, 403, 173, 120, 20, 173, 49],  
            [173, 49, 243, 120, 160, 240, 46, 210],       
          ]
      }  time= {6000} stroke='blue' strokeWidth={4}/>
      <AnimBezierShape path={
        [
          [46, 210, 243, 120, 160, 240, 146, 210],
          [146, 210 , 348, 24, 18, 93, 154, 185],
          [154, 185, 248, 164, 274, 156, 82, 81],
          [82, 81, 203, 73, 420, 120, 234, 19],
          [234, 19, 403, 273, 320, 120, 234, 319],
          [234, 319, 46, 201, 85, 79 , 173 ,149]
        ]
    }  time= {6000} stroke='black' strokeWidth={4}/>
      </ART.Surface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
});

AppRegistry.registerComponent('AnimBezierShape', () => AnimBezier);
