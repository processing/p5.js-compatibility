# p5.js-compatibility

Even as p5.js 2.0 becomes more stable, p5.js 1.x will continue to be supported until August, 2026. Between 1.x and 2.0, there are many additions, and some breaking changes. In addition to making p5.js 2.0 available as a library, we are working on preparing several compatibility add-on libraries that would make it possible to keep using 1.x features that are no longer part of 2.0.

We are working on three compatibility add-on libraries which will make these 1.x features available for 2.0:

1. [preload.js](https://github.com/processing/p5.js-compatibility/blob/main/src/preload.js)

2. [shapes.js](https://github.com/processing/p5.js-compatibility/blob/main/src/shapes.js)

3. [data.js](https://github.com/processing/p5.js-compatibility/blob/main/src/data.js)

Your feedback is welcome [on this issue](https://github.com/processing/p5.js/issues/7488)!

# How to update p5.js code from 1.x to 2.0

Most things are the same between p5.js 1.x and 2.0, but there are some big differences: p5.js 2.0 has new capabilities, and it also no longer supports some aspects of p5.js 1.x.

## Do I have to update my 1.x sketches?

First, you should try to update the version and see if the sketch still runs! In many cases, no actions are needed - just update the version and you’re all set.

However, if the sketch doesn’t run anymore using 2.0, then you can either update it to use 2.0, or keep it using 1.x. If any of this sounds applicable, then follow the guide below to update your sketches:

* If you want to use p5.js 2.0 features, like variable-weight fonts
* If you need your sketches to work after August, 2026. At that point, 1.x will no longer be supported, and 2.0 will become the default in the p5.js Editor. If you face any challenges in making updates, please consider [joining the discussion](https://github.com/processing/p5.js/issues/7488) and [filing bugs](https://github.com/processing/p5.js/issues) to help make p5.js 2.0 a robust tool for the whole community.
* If you want to use an add-on library or community library that uses p5.js 2.0 features
* If you want to be able to better integrate with other tools and libraries in the JavaScript ecosystem

## How can I update my 1.x sketches?

Step 1: Switch to 2.0 by using one of the [beta releases](https://github.com/processing/p5.js/releases/) when you import the core library! An [option to switch to 2.0 will be available in the p.js Editor](https://github.com/processing/p5.js-web-editor/pull/3334) once the new release is live!

Step 2: Try running your sketch! In many cases, this will work right away, and no other changes would be needed.

Step 3: If your 1.x sketch does not run with p5.js 2.0, you have two options:

* Update your code to match 2.0
* or include a compatibility add-on library ([this will also be possible in the p.js Editor](https://github.com/processing/p5.js-web-editor/pull/3334) once the new release is live.

# Changes to make if your sketch includes…

## …loading images, sound, fonts, and other assets

One of the biggest changes in 2.0 is involves how you can include other files, media, and assets. The p5.js 1.x style of using `preload()` does not reflect anymore how assets are loaded on the web, so p5.js 2.0 uses JavaScript’s async/await keywords to support asynchronicity.

If you’re interested in the history of async [read on here](https://dev.to/limzykenneth/asynchronous-p5js-20-458f)!

To play around, check out [the example from the p5.js 1.x `preload()` reference](https://p5js.org/reference/p5/preload/), but get a very big file instead of bricks.jpg.



<table>
<tr><th>p5.js 1.x</th><th>p5.js 2.x</th></tr>
<tr><td>Blank “Loading…” screen, then image shown</td><td>Red background while image loads</td></tr>
<tr><td>

```js
let img;

function preload() {
  img = loadImage('bricks.jpg');
}

function setup() {
  createCanvas(100, 100);

  // Red backgorund is ignored
  background(255, 0, 0);

  // Draw the image.
  image(img, 0, 0);

  describe('A red brick wall.');
}
```

</td><td>

```js
let img;

async function setup() {
  createCanvas(100, 100);

  // Red background while asset loads
  background(255, 0, 0);

  // Wait for the image to load
  img = await loadImage('bricks.jpg');

  // Draw the image.
  image(img, 0, 0);

  describe('A red brick wall.');
}
```

</td></tr>
</table>

If it takes a while to load the image, the sketch will be "paused" on the line `img = await loadImage('/assets/bricks.jpg');` - once the image is loaded, it will resume.


## …using registerPreloadMethod in an add-on libraries

Under to hood, returns a **Promise** from each loadImage, loadSound, and similar functions. Promises are widely used in JavaScript, so it is possible to use a callback in p5.js 1.x to create a Promise, but p5.js 1.x doesn't expect promises to be used, so you have to ensure yourself that, for example, your draw function doesn't start running before loading is done. For an example of a Promise using a callback, check out the example below that makes p5.sound.js compatible with both 1.x and 2.0:

If your add-on library built with p5.js 1.x uses `registerPreloadMethod` such as in this example from [p5.sound.js](https://github.com/processing/p5.sound.js):

```js
p5.prototype.registerPreloadMethod('loadSound', p5.prototype);
```

Then to make your add-on library compatible with **both p5.js 1.x *(preload)* and p5.js 2.0 *(promises)***, this this line can be removed (the method `loadSound`, in this example, does not need to be registered) and the method can be updated as follows:

```js
function loadSound (path) {
   if(self._incrementPreload && self._decrementPreload){
     // tTis is the check to determine if preload() is being used, as with
     // p5.js 1.x or with the preload compatibility add-on library. The function
     // returns the soundfile.
 
     self._incrementPreload();
 
     let player = new p5.SoundFile(
       path,
       function () {
         // The callback indicates to preload() that the file is done loading
         self._decrementPreload();
       }
     );
     return player;
 
   }else{
     // Otherwise, async/await is being used, so the function returns a promise,
     // which loads the soundfile asynchronously.

     return new Promise((resolve) => {
       let player = new p5.SoundFile(
         path,
         function () {
           // The callback resolves the promise when the file is done loading
           resolve(player);
         }
       );
     });
   }
 }
```

And that's it! You can check this example of making an add-on library backwards-compatible and work with p5.js 2.0 here: [the p5.sound.js example](https://github.com/processing/p5.sound.js/commit/608ffa93f241538c4fb353544f6d01275911d212)

## …making shapes

If you use `vertex` and `bezierVertex` is the p5.js 1.x code, here's how you can approach updating your code.

The below code is based on the [custom shapes](https://p5js.org/tutorials/custom-shapes-and-smooth-curves/) tutorial:

```js
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
}
function draw() {
  translate(width/2, height/2);
  
  // Draw the curved star shape - use one of the snippets below, depending on p5.js version

  describe("A white star on a gray background in the middle of the canvas")
}
```

<table>
<tr><th>p5.js 1.x</th><th>p5.js 2.x</th></tr>
<tr><td>

```js
// Draw the curved star shape.
beginShape();

// Original anchor at top.
vertex(0, -100);

// Top-right curve.
bezierVertex(0, -50, 50, 0, 100, 0);

// Bottom-right curve.
bezierVertex(50, 0, 0, 50, 0, 100);

// Bottom-left curve.
bezierVertex(0, 50, -50, 0, -100, 0);

// Top-left curve.
bezierVertex(-50, 0, 0,-50, 0,-100);
endShape();
```

</td><td>


```js
// Draw the curved star shape.
beginShape();

// The default value is 3, 
bezierOrder(3);

// Original anchor at top.
bezierVertex(0, -100);

// Top-right curve.
bezierVertex(0, -50);
bezierVertex(50, 0);
bezierVertex(100, 0);

// Bottom-right curve.
bezierVertex(50, 0);
bezierVertex(0, 50);
bezierVertex(0, 100);

// Bottom-left curve.
bezierVertex(0, 50);
bezierVertex(-50, 0);
bezierVertex(-100, 0);

// Top-left curve.
bezierVertex(-50, 0);
bezierVertex(0, -50);
bezierVertex(0,-100);

endShape();
```

</td></tr>
<tr><td>

```js
// https://p5js.org/reference/p5/quadraticVertex/
function setup() {
  createCanvas(100, 100);

  background(200);

  // Start drawing the shape.
  beginShape();

  // Add the curved segments.
  vertex(20, 20);
  quadraticVertex(80, 20, 50, 50);
  quadraticVertex(20, 80, 80, 80);

  // Add the straight segments.
  vertex(80, 10);
  vertex(20, 10);
  vertex(20, 20);

  // Stop drawing the shape.
  endShape();

  describe('White puzzle piece on a gray background.');
}
```
</td><td>


```js
// Achieve the same curve with bezierOrder(2)
function setup() {
  createCanvas(100, 100);

  background(200);

  // Start drawing the shape.
  beginShape();

  bezierOrder(2);

  // Add the curved segments.
  bezierVertex(20, 20);
  bezierVertex(80, 20);
  bezierVertex(50, 50);
  bezierVertex(20, 80);
  bezierVertex(80, 80);

  // Add the straight segments.
  vertex(80, 10);
  vertex(20, 10);
  vertex(20, 20);

  // Stop drawing the shape.
  endShape();

  describe('White puzzle piece on a gray background.');
}
```

</td></tr>
</table>

The [custom shapes tutorial](https://p5js.org/tutorials/custom-shapes-and-smooth-curves/) has a bit more detail on this, but Bézier curves need multiple points. In p5.js 1.x, they use three control points. In p5.js 2.0, that number is set by `bezierOrder`. Then, in p5.js 1.x each `bezierVertex(...)` was actually a set of three points describing a smooth curve. In p5.js 2.0, each `bezierVertext(x, y)` is just one point; you need the first point to anchor, and each curve after that needs 3 points.

Additional shanges to shapes in p5.js 1.x, compared to p5.js 2.0, are as follows:

* Name changes - functionality stays the same, but the functiona is more consistently named:
  * `curveVertex()` renamed to `splineVertex()`
  * `curvePoint()` renamed to `splinePoint()`
  * `curveTangent()` renamed to `splineTangent()`
  * `curve()` renamed to `spline()`
  * `curveTightness(t)` renamed to `splineProperty('tightness', t)`
* Geometry cleanup
  * p5.js 1.x has functionality in `beginGeometry()`, `endGeometry()` that is covered in `buildGeometry()`
  * p5.js 2.0 only keeps `buildGeometry()`
* Sampling detail cleanup
  * p5.js 1.x has separate `curveDetail()` and `bezierDetail()`
  * p5.js 2.0 uses `curveDetail()` to cover both, as the more general function

All of the above usages in p5.js 1.x remain available with the shapes.js compatibility add-on library.

## …using data structures and functions that have improved alternatives

One bit change relates to data structures in JavaScript. The following funcitons have been removed in p5.js 2.0. These were originally in p5.js 1.x because, historically, they were also in Processing. However, p5.js is a JavaScript library, and JavaScript objects and key-value maps can be used instead of these functions:

* `createStringDict()`
* `createNumberDict()`
* `p5.TypedDict`
* `p5.NumberDict`

Instead of the above functions, we would recommend using [built-in JavaScript Objects](https://p5js.org/reference/p5/Object/ )

The below functions are also better supported in JavaScript itself:

* `append()`
* `arrayCopy()`
* `concat()`
* `reverse()`
* `shorten()`
* `sort()`
* `splice()`
* `subset()`

Additionally, `touchStarted()/touchEnded()/touchMoved()` have been replaced with mouse events.
