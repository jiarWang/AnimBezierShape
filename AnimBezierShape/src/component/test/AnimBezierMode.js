import React, { Component, A } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ART,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
 class AnimBezier extends Component {

  constructor(props) {
    super(props);
    this.params = {
      timeCount: 3000,  //the time you want spend on this draw anim
      originX: 45,  //p0.x
      originY: 346, //p0.y
      c1X: 126,  //p1.x
      c1Y: 130,  //p1.y
      c2X: 279, //p2.x
      c2Y: 191,  //p2.y

      targetX: 195, //p3.x
      targetY: 259, //p3.y

      perLength: 10,  // paint distance during per defautTimeMin
      defaultTimeMin: 20,
    }

    this.state = {
      presentX0_1: this.params.originX,
      presentY0_1: this.params.originY,
      presentX1_2: this.params.c1X,
      presentY1_2: this.params.c1Y,
      presentX2_3: this.params.c2X,
      presentY2_3: this.params.c2Y,
      presentX01_12: this.params.originX,
      presentY01_12: this.params.originY,
      presentX12_23: this.params.c1X,
      presentY12_23: this.params.c1Y,
      originBZRx: this.params.originX,
      originBZRy: this.params.originY,
      presentBZRx: this.params.originX,
      presentBZRy: this.params.originY,
      presentTime: 0,
      pathBZR: ART.Path().moveTo(this.params.originX, this.params.originY)
    }
    //setInterval(()=>this.startAnimating(), 30)

    this.startTimer()
  }

  startTimer() {
    this.timer = setTimeout(
      () => {
        this.startAnimating();
        if (this.state.presentTime >= this.params.timeCount) {
          this.timer && clearTimeout(this.timer);
        } else {
          this.startTimer()
        }
      },
      this.params.defaultTimeMin
    );
  }

  startAnimating() {
    const part = this.params.timeCount / this.params.defaultTimeMin;
    this.state.presentX0_1 += (this.params.c1X - this.params.originX) / part;
    this.state.presentY0_1 += (this.params.c1Y - this.params.originY) / part;
    this.state.presentX1_2 += (this.params.c2X - this.params.c1X) / part;
    this.state.presentY1_2 += (this.params.c2Y - this.params.c1Y) / part;
    this.state.presentX2_3 += (this.params.targetX - this.params.c2X) / part;
    this.state.presentY2_3 += (this.params.targetY - this.params.c2Y) / part;
    this.state.presentTime += this.params.defaultTimeMin;

    //const n = this.state.presentTime/this.params.defaultTimeMin || 1;
    const t = this.state.presentTime / this.params.timeCount || 1;

    this.state.presentX01_12 = this.state.presentX0_1 + t * (this.state.presentX1_2 - this.state.presentX0_1);
    this.state.presentY01_12 = this.state.presentY0_1 + t * (this.state.presentY1_2 - this.state.presentY0_1);
    this.state.presentX12_23 = this.state.presentX1_2 + t * (this.state.presentX2_3 - this.state.presentX1_2);
    this.state.presentY12_23 = this.state.presentY1_2 + t * (this.state.presentY2_3 - this.state.presentY1_2);

    this.state.presentBZRx = this.state.presentX01_12 + t * (this.state.presentX12_23 - this.state.presentX01_12);
    this.state.presentBZRy = this.state.presentY01_12 + t * (this.state.presentY12_23 - this.state.presentY01_12);
    this.state.pathBZR = this.state.pathBZR.lineTo(this.state.presentBZRx, this.state.presentBZRy);
    this.setState(this.state);
  }

  getPath() {
    const {
      presentX0_1,
      presentY0_1,
      presentX1_2,
      presentY1_2,
      presentX2_3,
      presentY2_3,
      presentX01_12,
      presentY01_12,
      presentX12_23,
      presentY12_23,
      presentBZRx,
      presentBZRy,
      pathBZR
    } = this.state;

    const {
      originX,
      originY,
      c1X,
      c1Y,
      c2X,
      c2Y,
      targetX,
      targetY,
    } = this.params;

    let path_0 = ART.Path()
      .moveTo(originX, originY)
      .lineTo(c1X, c1Y)
      .lineTo(c2X, c2Y)
      .lineTo(targetX, targetY)
    // .lineTo(presentX1, presentY1)

    let path_1 = ART.Path()
      .moveTo(originX, originY)
      .lineTo(presentX0_1, presentY0_1) //p1
      .lineTo(presentX1_2, presentY1_2) //p2
      .lineTo(presentX2_3, presentY2_3) //p3;


    let path_2 = ART.Path()
      .moveTo(presentX01_12, presentY01_12)
      .lineTo(presentX12_23, presentY12_23)
    return {
      path0: path_0, //based on origin path.(p0->p1->p2->p3)
      path1: path_1,  //based on path0
      path2: path_2,  //based on path1
      pathBZR: pathBZR //Bezier path
    };
  }



  render() {

    let {
      path0,
      path1,
      path2,
      pathBZR
    } = this.getPath();

    return (
      <View style={styles.container}>
        <ART.Surface width={width} height={height} >
          <ART.Shape
            d={path0}
            stroke='#fff'
            strokeWidth={4}
          />
          <ART.Shape
            d={path1}
            stroke='#fff'
            strokeWidth={4}
          />
          <ART.Shape
            d={path2}
            stroke='#fff'
            strokeWidth={4}
          />
          <ART.Shape
            d={pathBZR}
            stroke='#4b0082'
            strokeWidth={4}
          />
        </ART.Surface>

        <Text>{this.state.presentTime}</Text>
      </View>
    );
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#dcdcdc',
    },
  });
module.exports = AnimBezier;