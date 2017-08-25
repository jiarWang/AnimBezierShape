/**
 * this file
 * just for my self to read if no one interested
 */

import React, { Component, A } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ART,
} from 'react-native';

const path = ART.Path();
const bezierCount = 1;

class AnimBezier extends Component {

  constructor(props) {
    super(props);
    
    let { X0, Y0, X1, Y1, X2, Y2, X3, Y3 } = this.props.points;
    let timeCount = this.setValue(this.props.time, 1000);
    let timeMin = this.setValue(this.props.timeMin, 20);

    let delay = this.setValue(this.props.delay, 0);
    let stroke = this.setValue(this.props.stroke, 'red')
    let strokeWidth = this.setValue(this.props.strokeWidth, 1);
    let isRepeat = this.setValue(this.props.isRepeat, false);

    let originX = this.setValue(X0, 0);//p0.x
    let originY = this.setValue(Y0, 0);  //p0.y
    let c1X = this.setValue(X1, 0);  //p1.x
    let c1Y = this.setValue(Y1, 0);  //p1.y
    let c2X = this.setValue(X2, 0); //p2.x
    let c2Y = this.setValue(Y2, 0);  //p2.y

    let targetX = this.setValue(X3, 0); //p3.x
    let targetY = this.setValue(Y3, 0); //p3.y
    this.params = {
      timeCount: timeCount,  //the time you want spend on this draw anim
      originX: originX, //p0.x
      originY: originY,  //p0.y
      c1X: c1X,  //p1.x
      c1Y: c1Y,  //p1.y
      c2X: c2X, //p2.x
      c2Y: c2Y,  //p2.y

      targetX: targetX, //p3.x
      targetY: targetY, //p3.y

      delay: delay,
      stroke: stroke,
      strokeWidth: strokeWidth,
      defaultTimeMin: timeMin,
      isRepeat: isRepeat
    }

    this.params2 ={
      originX : this.params.targetX,
      originY : this.params.targetY,
      c1X: 188,  //p1.x
      c1Y: 366,  //p1.y
      c2X: 252, //p2.x
      c2Y: 76,  //p2.y

      targetX: 70, //p3.x
      targetY: 190, //p3.y
      timeCount: 1000,

      delay: delay,
      stroke: stroke,
      strokeWidth: strokeWidth,
      defaultTimeMin: timeMin,
      isRepeat: isRepeat
    }

    this.initState(0);
    //setInterval(()=>this.startAnimating(), 30)
    this.timer = setTimeout(
      () => {
        this.startTimer();
      },
      this.params.delay
    );
    //this.startTimer()
  }

  startTimer() {
    this.timer = setTimeout(
      () => {
        this.startAnimating();
        if (this.state.presentTime === this.params.timeCount) {
          if(bezierCount === 2){
            this.timer && clearTimeout(this.timer);
          }else{
            bezierCount++;
            this.params = this.params2;
            this.initState();
            this.startTimer();
          }
          if(this.params.isRepeat){
            this.initState();
            this.startTimer();
          }
        }else{
          this.startTimer();
        }
          /*you can begain other anim-paint at the end of this anim, or start other action, if you want*/

          // this.params.originX = this.params2.originX;
          // this.params.originY = this.params2.originY;
        //   if(this.state.presentTime != this.params2.timeCount){
        //     // this.params.c1X     = this.params2.
        //  this.params = this.params2;
        //  this.initState();
        //  this.startTimer();
        //  }
          //----------------
        // }else if(this.state.presentTime >= this.params.timeCount){
        //   this.timer && clearTimeout(this.timer);
        // 
      },
      this.params.defaultTimeMin
    );
  }

  initState() {
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
      pathBZR: path.moveTo(this.params.originX, this.params.originY)
    }
  }

  setValue(value, defaultValue) {
    if (value === undefined || value === 0 || value === null) {
      return defaultValue;
    } else {
      return value;
    }
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



  render() {
    let pathBZR = this.state.pathBZR;
    return (
        <ART.Shape
          d={pathBZR}
          stroke={this.params.stroke}
          strokeWidth={this.params.strokeWidth}
        />
    );
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
}
module.exports = AnimBezier;