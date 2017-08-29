/*
 ******************************************************************************
 * Author	$Author: wangjian $
 * Version	$Revision: 0.0.1 $
 * Date		$Date: 2017/08/26 01:32:00 $
****************************************************************************** 
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

export const Path = require('./path');
const bezierCount = 0;

class AnimBezier extends Component {

  constructor(props) {
    super(props);
    
    this.bezierCount = 0;

    let points = this.props.path;
    if(!points.length) return;
    let timeCount = this.setValue(this.props.time, 1000 * points.length)/points.length;
    let timeMin = this.setValue(this.props.timeMin, 20);

    let delay = this.setValue(this.props.delay, 0);
    let stroke = this.setValue(this.props.stroke, 'red')
    let strokeWidth = this.setValue(this.props.strokeWidth, 1);
    let isRepeat = this.setValue(this.props.isRepeat, false);

    
    let originX = this.setValue(points[0][0], 0);
    let originY = this.setValue(points[0][1], 0);  
    let c1X = this.setValue(points[0][2], 0); 
    let c1Y = this.setValue(points[0][3], 0);  
    let c2X = this.setValue(points[0][4], 0); 
    let c2Y = this.setValue(points[0][5], 0);  

    let targetX = this.setValue(points[0][6], 0); 
    let targetY = this.setValue(points[0][7], 0); 
    this.params = {
      timeCount: timeCount,  //the time you want spend on this draw anim
      originX: originX, 
      originY: originY,  
      c1X: c1X,  
      c1Y: c1Y,  
      c2X: c2X, 
      c2Y: c2Y,  

      targetX: targetX, 
      targetY: targetY, 

      delay: delay,
      stroke: stroke,
      strokeWidth: strokeWidth,
      timeMin: timeMin,
      points: points,
      path: ART.Path(),
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
  } 
  resetParams(i){
    this.params.originX = this.params.points[i][0];
    this.params.originY = this.params.points[i][1];
    this.params.c1X     = this.params.points[i][2];
    this.params.c1Y     = this.params.points[i][3];
    this.params.c2X     = this.params.points[i][4];
    this.params.c2Y     = this.params.points[i][5];
    this.params.targetX = this.params.points[i][6];
    this.params.targetY = this.params.points[i][7]; 
  }


  startTimer() {
    this.timer = setTimeout(
      () => {
        this.startAnimating();
        if (this.state.presentTime + this.params.timeCount%this.params.timeMin  === this.params.timeCount) {
          if(this.bezierCount === this.params.points.length - 1){
            this.timer && clearTimeout(this.timer);
            if(this.params.isRepeat){
              this.bezierCount = 0;
              this.params.path.reset();
              this.resetParams(this.bezierCount);
              this.initState();
              this.startTimer();
            }
          }else{
            this.bezierCount++;
            this.resetParams(this.bezierCount);
            this.initState();
            this.startTimer();
          }
        }else{
          this.startTimer();
        }
      },
      this.params.timeMin
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
      pathBZR: this.params.path.moveTo(this.params.originX, this.params.originY)
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
    const part = this.params.timeCount / this.params.timeMin;
    this.state.presentX0_1 += (this.params.c1X - this.params.originX) / part;
    this.state.presentY0_1 += (this.params.c1Y - this.params.originY) / part;
    this.state.presentX1_2 += (this.params.c2X - this.params.c1X) / part;
    this.state.presentY1_2 += (this.params.c2Y - this.params.c1Y) / part;
    this.state.presentX2_3 += (this.params.targetX - this.params.c2X) / part;
    this.state.presentY2_3 += (this.params.targetY - this.params.c2Y) / part;
    this.state.presentTime += this.params.timeMin;

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