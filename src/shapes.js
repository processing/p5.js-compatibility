function addShapes(p5, fn, lifecycles) {
  const oldBezierVertex = fn.bezierVertex;
  const oldEndContour = fn.endContour;
  const oldEndShape = fn.endShape;

  lifecycles.predraw = function() {
    this.splineProperty('ends', this.EXCLUDE);
  }

  fn.quadraticVertex = function(...args) {
    this.bezierOrder(2);
    if (args.length === 4) {
      const [x1, y1, x2, y2] = args;
      oldBezierVertex.call(this, x1, y1);
      oldBezierVertex.call(this, x2, y2);
    } else if (args.length === 6) {
      const [x1, y1, z1, x2, y2, z2] = args;
      oldBezierVertex.call(this, x1, y1, z1);
      oldBezierVertex.call(this, x2, y2, z2);
    } else {
      throw new Error(
        `quadraticVertex() was expecting either 4 or 6 arguments, but it was called with ${args.length}.`
      );
    }
  }

  fn.bezierVertex = function(...args) {
    this.bezierOrder(3);
    if (args.length === 6) {
      const [x1, y1, x2, y2, x3, y3] = args;
      oldBezierVertex.call(this, x1, y1);
      oldBezierVertex.call(this, x2, y2);
      oldBezierVertex.call(this, x3, y3);
    } else if (args.length === 9) {
      const [x1, y1, z1, x2, y2, z2, x3, y3, z3] = args;
      oldBezierVertex.call(this, x1, y1, z1);
      oldBezierVertex.call(this, x2, y2, z2);
      oldBezierVertex.call(this, x3, y3, z3);
    } else {
      throw new Error(
        `bezierVertex() was expecting either 6 or 9 arguments, but it was called with ${args.length}.`
      );
    }
  }

  fn.curveVertex = function(...args) {
    return this.splineVertex(...args);
  }

  fn.curveTightness = function(value) {
    return this.splineProperty('tightness', value);
  }

  fn.endContour = function(mode = this.CLOSE, count) {
    oldEndContour.call(this, mode, count);
  }

  fn.endShape = function(mode) {
    this._renderer._currentShape.at(-1, -1).handlesClose = () => false;
    oldEndShape.call(this, mode);
  }

  fn.curve = function(...args) {
    return this.spline(...args);
  }
}

if (typeof p5 !== undefined) {
  p5.registerAddon(addShapes);
}
