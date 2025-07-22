# 2.0 is 🌻 live 🌻

* The [full p5.js 2.0 reference is here](https://beta.p5js.org/)
* Interested in contributing? Check for [ready for work](https://github.com/orgs/processing/projects/21/views/8) issues!

# p5.js-compatibility

Even as p5.js 2.0 becomes more stable, p5.js 1.x will continue to be supported until August, 2026. Between 1.x and 2.0, there are many additions, and some breaking changes. In addition to making p5.js 2.0 available as a library, we are working on preparing several compatibility add-on libraries that would make it possible to keep using 1.x features that are no longer part of 2.0.

We are working on three compatibility add-on libraries which will make these 1.x features available for 2.0:

1. [preload.js](https://github.com/processing/p5.js-compatibility/blob/main/src/preload.js)

2. [shapes.js](https://github.com/processing/p5.js-compatibility/blob/main/src/shapes.js)

3. [data.js](https://github.com/processing/p5.js-compatibility/blob/main/src/data.js)

These add-on libraries are available in the **p5.js Editor** in the Settings > Library Management modal:

<img width="300" alt="image" src="https://github.com/user-attachments/assets/eb074d21-841a-4649-825c-eb95f7c3c488" alt="Screenshot of the Settings model in p5.js Editor showing hte Library Management tab" />

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
* or include a compatibility add-on library (also possible in the p5.js Editor once the new release is live.)

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

Laslty, some loader functions have been updated:
* The [p5.js 1.x loadTable](https://p5js.org/reference/p5/loadTable/) expects `filename, [extension], [header], [callback], [errorCallback]`
* The [p5.js 2.0 loadTable](https://betap5js.org/reference/p5/loadTable/) expects `filename, [separator], [header], [callback], [errorCallback]`
* The [p5.js 1.x loadBytes](https://p5js.org/reference/p5/loadBytes/) returns an object with property `data` containing a `UInt8Array` (required because of preload)
* The [p5.js 2.0 loadBytes](https://betap5js.org/reference/p5/loadBytes/) returns the `UInt8Array` directly

All of the above usages in p5.js 1.x remain available with the [preload.js](https://github.com/processing/p5.js-compatibility/blob/main/src/preload.js) compatibility add-on library.

## …using registerPreloadMethod in an add-on libraries

Under the hood, returns a **Promise** from each loadImage, loadSound, and similar functions. Promises are widely used in JavaScript, so it is possible to use a callback in p5.js 1.x to create a Promise, but p5.js 1.x doesn't expect promises to be used, so you have to ensure yourself that, for example, your draw function doesn't start running before loading is done. For an example of a Promise using a callback, check out the example below that makes p5.sound.js compatible with both 1.x and 2.0:

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
</table>

<table>
<tr><th>p5.js 1.x</th><th>p5.js 2.x</th></tr>
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

  describe('White puzzle piece on gray background.');
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

  describe('White puzzle piece on gray background.');
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
* Defaults updated: in p5.js 1.x, `endContour()` is the same as `endContour(CLOSE)`

Finally, the behavior of `endShape` allows creating different shapes.


<table>
<tr><th>
  p5.js 1.x
  
![image](https://github.com/user-attachments/assets/7e476299-8b7a-4852-8922-65a6165ca0e4)
</th><th>
  p5.js 2.x
  
![image](https://github.com/user-attachments/assets/f5db1307-6339-4801-89be-b08c76253acf)
  
</th></tr>
<tr><td>

```js
function setup() {
  createCanvas(100, 100);
  background(200);
  beginShape();

  // Add the first control point.
  curveVertex(32, 91);
  curveVertex(32, 91);

  // Add the anchor points.
  curveVertex(21, 17);
  curveVertex(68, 19);

  // Add the second control point.
  curveVertex(84, 91);
  curveVertex(84, 91);

  // Stop drawing the shape.
  endShape(CLOSE);
}
```
</td><td>


```js
function setup() {
  createCanvas(100, 100);
  background(200);
  beginShape();

  // Control points not needed
  // if the goal is a smooth close
  // splineVertex(32, 91);
  splineVertex(32, 91);

  // Add the anchor points.
  splineVertex(21, 17);
  splineVertex(68, 19);

  // Second control point also excluded
  // splineVertex(82, 91);
  splineVertex(82, 91);
  endShape(CLOSE);
}
```

</td></tr>
</table>

All of the above usages in p5.js 1.x remain available with the [shapes.js](https://github.com/processing/p5.js-compatibility/blob/main/src/shapes.js) compatibility add-on library.

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

Finally, touch and mouse event handling has been combined to improve sketch consistency across devices:

* `touchStarted()`
* `touchEnded()`
* `touchMoved()`

In p5.js 2.0, instead of having separate methods for mouse and touch, we now use the browser's pointer API to handle both simultaneously. Try defining mouse functions as usual and accessing the global touches array to see what pointers are active for multitouch support!

All of the above usages in p5.js 1.x remain available with the [data.js](https://github.com/processing/p5.js-compatibility/blob/main/src/data.js) compatibility add-on library.

## …using mouseButton events:

In 1.X, where the `mouseButton` was a single variable that could have values `left`, `right` and `center`, we cannot detect if the `left` and `right` button have been pressed together.
In 2.X, the `mouseButton` is now an object with properties: `left`, `right` and `center`, which are booleans indicating whether each button has been pressed respectively.
This means that we can now detect if multiple buttons are pressed together (like if the `left` and `right` button are pressed together).

```js
function setup() {
  createCanvas(100, 100);

  describe(
    "A gray square. Different shapes appear at its center depending on the mouse button that's pressed."
  );
}
```

<table>
<tr><th>p5.js 1.x</th><th>p5.js 2.x</th></tr>
<tr><td>

```js
function draw() {
  background(200);
  fill(255, 50);

  if (mouseIsPressed === true) {
    if (mouseButton === LEFT) {
      circle(50, 50, 50);
    }
    if (mouseButton === RIGHT) {
      square(25, 25, 50);
    }
    if (mouseButton === CENTER) {
      triangle(23, 75, 50, 20, 78, 75);
    }
  }
}
```

</td><td>


```js
function draw() {
  background(200);
  fill(255, 50);

  if (mouseIsPressed === true) {
    if (mouseButton.left) {
      circle(50, 50, 50);
    }
    if (mouseButton.right) {
      square(25, 25, 50);
    }
    if (mouseButton.center) {
      triangle(23, 75, 50, 20, 78, 75);
    }
  }
}
```

</td></tr>
</table>

Notice that when you press multiple buttons at the same time, multiple shapes can be obtained.

## …using keyCode events:

The sketch below works in both versions, but try to use it while quickly pressing different arrow keys - you will notice that the event handling in p5.js 2.x is smoother:

```js
let x = 50;
let y = 50;

function setup() {
  createCanvas(100, 100);

  background(200);

  describe(
    'A gray square with a black circle at its center. The circle moves when the user presses an arrow key. It leaves a trail as it moves.'
  );
}

function draw() {
  // Update x and y when arrow keys are pressed
  // Using keyIsDown() will work in all version of p5.js
  if (keyIsPressed) {
    if (keyIsDown(UP_ARROW)) {
      y -= 1;
    } else if (keyIsDown(DOWN_ARROW)) {
      y += 1;
    } else if (keyIsDown(LEFT_ARROW)) {
      x -= 1;
    } else if (keyIsDown(RIGHT_ARROW)) {
      x += 1;
    }
  }
  
  // Style the circle.
  fill(0);

  // Draw the circle at (x, y).
  circle(x, y, 5);
}
```


Although `keyIsDown()` can be used with system-level constants like `UP_ARROW` in all versions, the below shows a bit of what has changed behind the scenes - so if you use `key` or `code` in your sketch, you may need to update your code:

<table>
<tr><th>p5.js 1.x</th><th>p5.js 2.x</th></tr>
<tr><td>

```js
function draw() {
  // Update x and y when arrow keys are pressed
  if (keyIsPressed === true) {
    if (keyCode === UP_ARROW) {
      y -= 1;
    } else if (keyCode === DOWN_ARROW) {
      y += 1;
    } else if (keyCode === LEFT_ARROW) {
      x -= 1;
    } else if (keyCode === RIGHT_ARROW) {
      x += 1;
    }
  }

  // Style the circle.
  fill(0);

  // Draw the circle at (x, y).
  circle(x, y, 5);
}
```

</td><td>

```js
function draw() {
  // Update x and y when arrow keys are pressed
  if (code === UP_ARROW) {
    y -= 1;
  } else if (code === DOWN_ARROW) {
    y += 1;
  } else if (code === LEFT_ARROW) {
    x -= 1;
  } else if (code === RIGHT_ARROW) {
    x += 1;
  }

  // Style the circle.
  fill(0);

  // Draw the circle at (x, y).
  circle(x, y, 5);
}
```

</td></tr>
</table>


`keyCode` is still a `Number` system variable in 2.x.

```js
if (keyCode === 13) {
  // Code to run if the enter key was pressed.
}
```

In 1.x system variables could be used using keyCode
```js
if (keyCode === "ENTER") {
  // Code to run if the enter key was pressed.
}
```

Instead, in 2.x you can use the `key` or `code` function to directly compare the key value.

Using `key`:
```js
if (key === 'Enter') {
  // Code to run if the Enter key was pressed.
}
```

Using `code`:
```js
if (code === 'KeyA') { 
  // Code to run if the 'A' key was pressed.
}
```

Both numeric and string key codes can be found at [keycode.info](https://www.toptal.com/developers/keycode).
