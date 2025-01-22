# p5.js-compatibility

Addons that add p5.js 1.x to p5.js 2.x

Even as p5.js 2.0 becomes more stable, p5.js 1.x will continue to be supported for at least a year. Between 1.x and 2.0, there are many additions, and some breaking changes. In addition to making p5.js 2.0 available as a library, we are working on preparing several compatibility addons that would make it possible to keep using 1.x features that are no longer part of 2.0.

We are working on three compatibility addons which will make these 1.x features available for 2.0:

1. Preload()

2. beginShape/endShape API

3. Data structures (all the functions listed in the previous questions)

So, for example, if you want to use something like `preload()`, which has been removed in 2.0, you could use a `<script>` tag to import both p5.js 2.0 and the compatibility addon for that feature. If you do that, any use of preload() just like in 1.x will continue to work.
