/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import M from './App';
export default class App extends Component{
  render(){
    return (<M/>);
  }
}
AppRegistry.registerComponent('M', () => App);
