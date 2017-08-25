# AnimBezierShape

## How to use ?
 
 1) DownLoad [AnimBezierShape.js] and copy to you project file;

 2) `import` this component by:

 ```jsx
 import AnimBezierShape from './src/component/AnimBezierShape';
 ```

 3) Using it in your `ART.Surface`, just like use a `ART.Shape`, for example:

 ```jsx
 export default class AnimBezier extends Component {

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

 ## Props in `AnimBezierShpe`

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

For getting a consecutive curve we advice you make the Array[i]'s end point equal to Array[i+1]'s start point.If you want a beeline for start-point to end-point, you can insert a
[sx, sy,sx, sy, ex, ey, ex, ey] in your `path`;

### `time`
Multiple of 100, eg: 1000. 1000 means that it will cost you 1s to draw a bezier, default 1000;

### `timeMin`
Point a small path per `timeMin`, so as the `timeMin` get lesser the bezier will smoother, and more time would waste in rendering ( so we don't recommend this property), default 20.

### `delay`
In Milliseconds, if you don't want render this `AnimBezierShape` right now, you can set a `delay`, default 0

### `stroke`
The stroke's color, default 'red'

###`strokeWidth`

The stroke's width, default 1


