
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
let p = AnimPath()
  .moveTo(100, 100)
  .lineTo(100, 300)
  .lineTo(300, 300)
  .lineTo(250, 250)
  .lineTo(210, 50)
  .close();
export default class M extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ART.Surface width={width} height={height} >
          <AnimShape path={p.getPointsArray()} time={3000} stroke='blue' strokeWidth={10} isRepeat={true} />
          <AnimShape path={p.getPointsArray()} time={3000} stroke='#F5FCFF' strokeWidth={12} delay={500} isRepeat={true} />
          <ART.Shape d={ART.Path().moveTo(100, 100)
            .lineTo(100, 300)
            .lineTo(300, 300)
            .lineTo(250, 250)
            .lineTo(210, 50)
            .close()}
            stroke="#000000" strokeWidth={1} strokeDash={[10,10]}/>
          <AnimShape
            path={
              AnimPath().moveTo(200, 100)
                .arc(0, 100, 25)
                .arc(0, - 100, 25)
                .setTranslate(100, -20)
                .getPointsArray()
            }
            time={2000} stroke='red' strokeWidth={4} isRepeat={true} />
          <AnimShape
            path={
              AnimPath('M 50.000 60.000 L 61.756 66.180 L 59.511 53.090 L 69.021 43.820 L 55.878 41.910 L 50.000 30.000 L 44.122 41.910 L 30.979 43.820 L 40.489 53.090 L 38.244 66.180 L 50.000 60.000').setTranslate(20, 100).getPointsArray()
            }
            time={2000} stroke='green' strokeWidth={4} isRepeat={true} />

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