# p5.js-compatibility

Addons that add p5.js 1.x to p5.js 2.x

## What do you think?

Your feedback is welcome [in this survey](https://docs.google.com/forms/d/e/1FAIpQLSeDnDeE2rNyLS-y7L2FncLfzqzt-eWo8t7USktLjAzafuaeKg/viewform) or [on this issue](https://github.com/processing/p5.js/issues/7488)!

## Compatibility Addons

Even as p5.js 2.0 becomes more stable, p5.js 1.x will continue to be supported for at least a year. Between 1.x and 2.0, there are many additions, and some breaking changes. In addition to making p5.js 2.0 available as a library, we are working on preparing several compatibility addons that would make it possible to keep using 1.x features that are no longer part of 2.0.

We are working on three compatibility addons which will make these 1.x features available for 2.0:

1. `preload()`

2. `beginShape`/`endShape` API

3. Data structures (see full list below)

So, for example, if you want to use something like `preload()`, which has been removed in 2.0, you could use a `<script>` tag to import both p5.js 2.0 and the compatibility addon for that feature. If you do that, any use of preload() just like in 1.x will continue to work.

## Data Structures 1.x Compatibility

One bit change relates to data structures in JavaScript. We’re planning on removing the following functions in p5.js 2.0.

These were originally in p5.js because, historically, they were also in Processing. However, p5.js is a JavaScript library, and JavaScript objects and key-value maps can be used instead of these functions:

* `createStringDict()`
* `createNumberDict()`
* `p5.TypedDict`
* `p5.NumberDict`

Instead of the above functions, we would recommend using built-in JavaScript Objects: https://p5js.org/reference/p5/Object/ 

The below functions are also better supported in JavaScript itself:

* `append()`
* `arrayCopy()`
* `concat()`
* `reverse()`
* `shorten()`
* `sort()`
* `splice()`
* `subset()`

Lastly, `table` IO functions would also be affected:

* `loadTable()`
* `saveTable()`
* `p5.Table`
* `p5.TableRow`
