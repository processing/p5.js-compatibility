# p5.js-compatibility

Addons that add p5.js 1.x featureto p5.js 2.x

Even as p5.js 2.0 becomes more stable, p5.js 1.x will continue to be supported for at least a year. Between 1.x and 2.0, there are many additions, and some breaking changes. In addition to making p5.js 2.0 available as a library, we are working on preparing several compatibility addons that would make it possible to keep using 1.x features that are no longer part of 2.0.

We are working on three compatibility addons which will make these 1.x features available for 2.0:

1. [preload.js](https://github.com/processing/p5.js-compatibility/blob/main/src/preload.js)

2. [shapes.js](https://github.com/processing/p5.js-compatibility/blob/main/src/shapes.js)

3. Data structures

Your feedback is welcome [on this issue](https://github.com/processing/p5.js/issues/7488)!

# How to update p5.js code from 1.x to 2.0

Most things are the same between p5.js 1.x and 2.0, but there are some big differences: p5.js 2.0 has new capabilities, and it also no longer supports some aspects of p5.js 1.x.

## Do I have to update my 1.x sketches?

First, you should try to update the version and see if the sketch still runs! In many cases, no actions are needed - just update the version and you’re all set.

However, if the sketch doesn’t run anymore using 2.0, then you can either update it to use 2.0, or keep it using 1.x. If any of this sounds applicable, then follow the guide below to update your sketches:

* If you want to use p5.js 2.0 features, like variable-weight fonts
* If you need your sketches to work after August, 2026. At that point, 1.x will no longer be supported, and 2.0 will become the default in the p5.js Editor. If you face any challenges in making updates, please consider [joining the discussion](https://github.com/processing/p5.js/issues/7488) and [filing bugs](https://github.com/processing/p5.js/issues) to help make p5.js 2.0 a robust tool for the whole community.
* If you want to use an addon or community library that uses p5.js 2.0 featurescal
* If you want to be able to better integrate with other tools and libraries in the JavaScript ecosystem

## How can I update my 1.x sketches?

Step 1: Switch to 2.0 by using one of the [beta releases](https://github.com/processing/p5.js/releases/) when you import the core library! An [option to switch to 2.0 will be available in the p.js Editor](https://github.com/processing/p5.js-web-editor/pull/3334) once the new release is live!

Step 2: Try running your sketch! In many cases, this will work right away, and no other changes would be needed.

Step 3: If your 1.x sketch does not run with p5.js 2.0, you have two options:

* Update your code to match 2.0
* or (2) Include a compatibility addon (after release, [this will also be possible in the p.js Editor](https://github.com/processing/p5.js-web-editor/pull/3334) once the new release is live.

# Changes to make if your sketch includes…

## …loading images, sound, fonts, and other assets

One of the biggest changes in 2.0 is involves how you can include other files, media, and assets. The p5.js 1.x style of using `preload()` does not reflect anymore how assets are loaded on the web, so p5.js 2.0 uses JavaScript’s async/await keywords to support asynchronicity.

If you’re interested in the history of async [read on here](https://dev.to/limzykenneth/asynchronous-p5js-20-458f)!

To play around, check out [the example from the p5.js 1.x `preload()` reference](https://p5js.org/reference/p5/preload/), but get a very big file instead of bricks.jpg.

This is the p5.js 1.x code, and it will result in a blank “Loading…” screen and then show the image:

```
let img;

// Load an image and create a p5.Image object.
function preload() {
  img = loadImage('/assets/bricks.jpg');
}

function setup() {
  createCanvas(100, 100);
  
  // Make a red background - will not actually see this in 1.x
  background(255, 0, 0);

  // Draw the image.
  image(img, 0, 0);

  describe('A red brick wall.');
}
```

Using p5.js 2.0, and it will result in the red background being shown before the image loads, so people viewing your sketch don’t have to look at a blank screen:

```
let img;

async function setup() {
  createCanvas(100, 100);
  img = await loadImage('/assets/bricks.jpg');
  
  // Make a red background - in 2.0 will be shown while the image loads
  background(255, 0, 0);

  // Draw the image.
  image(img, 0, 0);

  describe('A red brick wall.');
}
```

## …making shapes

Short guide coming soon! For now, you can [find out more here](https://github.com/processing/p5.js/issues/6766)

## …using non-JavaScript data structures and functions

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

