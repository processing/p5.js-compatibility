function addPreload(p5, fn, lifecycles) {
  const methods = {
    'loadImage': () => new p5.Image(1, 1),
    'loadModel': () => new p5.Geometry(),
    'loadJSON': () => {},
    'loadStrings': () => [],
    'loadFont': (pInst) => new p5.Font(pInst, new FontFace('default', 'default.woff')),
  };

  p5.isPreloadSupported = function() {
    return true;
  };
  
  const promises = [];
  const prevMethods = {};
  
  // Override existing methods to return an object immediately,
  // and keep track of all things being loaded
  for (const method in methods) {
    const prevMethod = fn[method];
    prevMethods[method] = prevMethod;

    fn[method] = function(...args) {
      if (!this._isInPreload) {
        return prevMethod.apply(this, args);
      }
      const obj = methods[method](this);
      const promise = prevMethod.apply(this, args).then((result) => {
        for (const key in result) {
          obj[key] = result[key];
        }
      });
      promises.push(promise);
      return obj;
    }
  }

  const prevLoadBytes = fn.loadBytes;
  fn.loadBytes = function(...args) {
    if (!this._isInPreload) return prevLoadBytes.apply(this, args);

    const obj = {};
    const promise = prevLoadBytes.apply(this, args).then((result) => {
      obj.bytes = result;
    });
    promises.push(promise);
    return obj;
  };

  const prevLoadTable = fn.loadTable;
  fn.loadTable = function(...args) {
    if (args.length > 1 && args[1] instanceof String) {
      if (args[1] === 'csv') {
        args[1] = ',';
      } else if (args[1] === 'tsv') {
        args[1] = '\t';
      } else if (args[1] === 'ssv') {
        args[1] = ';';
      }
    }
    if (!this._isInPreload) return prevLoadTable.apply(this, args);

    const obj = new p5.Table();
    const promise = prevLoadTable.apply(this, args).then((result) => {
      for (const key in result) {
        obj[key] = result[key];
      }
    });
    promises.push(promise);
    return obj;
  };

  lifecycles.presetup = async function() {
    if (!window.preload) return;

    this._isInPreload = true;
    window.preload();
    this._isInPreload = false;

    // Wait for everything to load before letting setup run
    await Promise.all(promises);
  }
}

if (typeof p5 !== undefined) {
  p5.registerAddon(addPreload);
}
