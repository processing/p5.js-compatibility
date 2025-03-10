function addTypeDict(p5, fn){
  fn.createStringDict = function (key, value) {
    return new p5.StringDict(key, value);
  };

  fn.createNumberDict = function (key, value) {
    return new p5.NumberDict(key, value);
  };

  p5.TypedDict = class TypedDict {
    constructor(key, value) {
      if (key instanceof Object) {
        this.data = key;
      } else {
        this.data = {};
        this.data[key] = value;
      }
      return this;
    }

    size() {
      return Object.keys(this.data).length;
    }

    hasKey(key) {
      return this.data.hasOwnProperty(key);
    }

    get(key) {
      if (this.data.hasOwnProperty(key)) {
        return this.data[key];
      } else {
        console.log(`${key} does not exist in this Dictionary`);
      }
    }

    set(key, value) {
      if (this._validate(value)) {
        this.data[key] = value;
      } else {
        console.log('Those values dont work for this dictionary type.');
      }
    }

    _addObj(obj) {
      for (const key in obj) {
        this.set(key, obj[key]);
      }
    }

    create(key, value) {
      if (key instanceof Object && typeof value === 'undefined') {
        this._addObj(key);
      } else if (typeof key !== 'undefined') {
        this.set(key, value);
      } else {
        console.log(
          'In order to create a new Dictionary entry you must pass ' +
          'an object or a key, value pair'
        );
      }
    }

    clear() {
      this.data = {};
    }

    remove(key) {
      if (this.data.hasOwnProperty(key)) {
        delete this.data[key];
      } else {
        throw new Error(`${key} does not exist in this Dictionary`);
      }
    }

    print() {
      for (const item in this.data) {
        console.log(`key:${item} value:${this.data[item]}`);
      }
    }

    saveTable(filename) {
      let output = '';

      for (const key in this.data) {
        output += `${key},${this.data[key]}\n`;
      }

      const blob = new Blob([output], { type: 'text/csv' });
      fn.downloadFile(blob, filename || 'mycsv', 'csv');
    }

    saveJSON(filename, opt) {
      fn.saveJSON(this.data, filename, opt);
    }

    _validate(value) {
      return true;
    }
  };

  p5.StringDict = class StringDict extends p5.TypedDict {
    constructor(...args) {
      super(...args);
    }

    _validate(value) {
      return typeof value === 'string';
    }
  };

  p5.NumberDict = class NumberDict extends p5.TypedDict {
    constructor(...args) {
      super(...args);
    }

    _validate(value) {
      return typeof value === 'number';
    }

    add(key, amount) {
      if (this.data.hasOwnProperty(key)) {
        this.data[key] += amount;
      } else {
        console.log(`The key - ${key} does not exist in this dictionary.`);
      }
    }

    sub(key, amount) {
      this.add(key, -amount);
    }

    mult(key, amount) {
      if (this.data.hasOwnProperty(key)) {
        this.data[key] *= amount;
      } else {
        console.log(`The key - ${key} does not exist in this dictionary.`);
      }
    }

    div(key, amount) {
      if (this.data.hasOwnProperty(key)) {
        this.data[key] /= amount;
      } else {
        console.log(`The key - ${key} does not exist in this dictionary.`);
      }
    }

    _valueTest(flip) {
      if (Object.keys(this.data).length === 0) {
        throw new Error(
          'Unable to search for a minimum or maximum value on an empty NumberDict'
        );
      } else if (Object.keys(this.data).length === 1) {
        return this.data[Object.keys(this.data)[0]];
      } else {
        let result = this.data[Object.keys(this.data)[0]];
        for (const key in this.data) {
          if (this.data[key] * flip < result * flip) {
            result = this.data[key];
          }
        }
        return result;
      }
    }

    minValue() {
      return this._valueTest(1);
    }

    maxValue() {
      return this._valueTest(-1);
    }

    _keyTest(flip) {
      if (Object.keys(this.data).length === 0) {
        throw new Error('Unable to use minValue on an empty NumberDict');
      } else if (Object.keys(this.data).length === 1) {
        return Object.keys(this.data)[0];
      } else {
        let result = Object.keys(this.data)[0];
        for (let i = 1; i < Object.keys(this.data).length; i++) {
          if (Object.keys(this.data)[i] * flip < result * flip) {
            result = Object.keys(this.data)[i];
          }
        }
        return result;
      }
    }

    minKey() {
      return this._keyTest(1);
    }

    maxKey() {
      return this._keyTest(-1);
    }
  };
}