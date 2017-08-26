# AnimBezierShape  [![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.1.23&x2=0)](https://www.npmjs.com/package/art-anim-bezier-shape)

## Introduction

A [video][2] about `AnimBezierShape`;

if you couldn't reach this video, you can download this [apk][4] and install it, it's just a very simple bezier.

## How to use ?
 
 *  `npm install art-anim-bezier-shape`;

 * `const AnimBezierShape = require('art-anim-bezier-shape');`:

Then you can Using it in your `ART.Surface`, just like using a `ART.Shape`, for example:

 ```jsx
 ......
 
/* Get window's size , remember to import Dimension before use it*/
const { width, height } = Dimensions.get('window'); 
const AnimBezierShape = require('art-anim-bezier-shape');

 export default class AnimBezier extends Component {
   ......
  render() {
    return (
      <View style={styles.container}>
      <ART.Surface width={width} height={height} >
       <AnimBezierShape path={
          [
            [173, 149 , 48, 264, 274, 156, 82, 81],   
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
 ```
  ***Note***: `AnimBezierShape` is based on `ART`,so you should `import {ART} from 'react-native'`,before use `AnimBezierShape`.

 ### Props in `AnimBezierShpe`

 Property | Type | Must | tag
:-:|:-:|:-:|:-:
path|double[8][n]|true|path
time|int|false|length of time
timeMin|int|false|length of time for each paint
delay|int| false| length of time before start animation
stroke|Color|false| the stroke's color
strokeWidth|int|false| the stroke width

 ### `path`

path is made by a Array[count][sx, sy, c1x, c1y, c2x, c2y, ex, ey], Each Array[i]
means a bezier curve, the type of this 8 property are `double`:

* `sx`, `sy`: the start point's location
* `c1x`, `c1y`: the first curve-controller's location
* `c2x`, `c2y`: the second curve-controller's location
* `ex`, `ey`: the end point's location

***Advice***: 

For getting a consecutive curve we advice you to make the Array[i]'s end point equal to Array[i+1]'s start point.If you want a beeline for start-point to end-point, you can insert a
[sx, sy,sx, sy, ex, ey, ex, ey] in your `path`;

Here is a Circle example, which may help you if a Circle Animation is needed. It is made by two semi-circle:

```jsx
/* Get window's size , remember to import Dimension before use it*/
const { width, height } = Dimensions.get('window'); 

render() {
    let radio = 150;
    let h = 4.0 / 3.0 * radio;
   /*start point's location*/
    let x0 = 30;    
    let y0 = 300;
    return (
      <View style={styles.container}>
      <ART.Surface width={width} height={height} >
       <AnimBezierShape path={
          [
            [x0, y0, x0, y0 - h, x0 + 2 * radio, y0 - h, x0 + 2 * radio, y0],   
            [x0 + 2 * radio, y0, x0 + 2 * radio, y0 + h, x0, y0 + h, x0, y0],       
          ]
      }  time= {6000} stroke='blue' strokeWidth={4}/>
      </ART.Surface>
      </View>
    );
  }

```

### `time`
Multiple of 100, eg: 1000. 1000 means that it will cost you 1s to render this `AnimBezierShape`, default 1000;

### `timeMin`
Renderring a small path per `timeMin`, so as the `timeMin` get lesser the bezier will smoother, and more time would waste in rendering ( so we don't recommend this property), default 20.

### `delay`
In Milliseconds, if you don't want to render this `AnimBezierShape` right now, you can set a `delay`, default 0

### `stroke`
The stroke's color, default 'red'

### `strokeWidth`

The stroke's width, default 1


[1]:https://github.com/jiarWang/AnimBezierShape/blob/master/AnimBezierShape/src/component/AnimBezierShape.js
[2]:https://www.youtube.com/watch?v=BrToj99cEHo&feature=youtu.be
[4]:https://github.com/jiarWang/AnimBezierShape/blob/master/AnimBezierShape/android/app/app-release.apk
