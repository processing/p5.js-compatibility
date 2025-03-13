function addData(p5, fn){
  fn.append = function (array, value) {
    array.push(value);
    return array;
  };

  fn.arrayCopy = function (src, srcPosition, dst, dstPosition, length) {
    // the index to begin splicing from dst array
    let start;
    let end;

    if (typeof length !== 'undefined') {
      end = Math.min(length, src.length);
      start = dstPosition;
      src = src.slice(srcPosition, end + srcPosition);
    } else {
      if (typeof dst !== 'undefined') {
        // src, dst, length
        // rename  so we don't get confused
        end = dst;
        end = Math.min(end, src.length);
      } else {
        // src, dst
        end = src.length;
      }

      start = 0;
      // rename  so we don't get confused
      dst = srcPosition;
      src = src.slice(0, end);
    }

    // Since we are not returning the array and JavaScript is pass by reference
    // we must modify the actual values of the array
    // instead of reassigning arrays
    Array.prototype.splice.apply(dst, [start, end].concat(src));
  };

  fn.concat = (list0, list1) => list0.concat(list1);

  fn.reverse = list => list.reverse();

  fn.shorten = function (list) {
    list.pop();
    return list;
  };

  fn.sort = function (list, count) {
    let arr = count ? list.slice(0, Math.min(count, list.length)) : list;
    const rest = count ? list.slice(Math.min(count, list.length)) : [];
    if (typeof arr[0] === 'string') {
      arr = arr.sort();
    } else {
      arr = arr.sort((a, b) => a - b);
    }
    return arr.concat(rest);
  };

  fn.splice = function (list, value, index) {
    // note that splice returns spliced elements and not an array
    Array.prototype.splice.apply(list, [index, 0].concat(value));

    return list;
  };

  fn.subset = function (list, start, count) {
    if (typeof count !== 'undefined') {
      return list.slice(start, start + count);
    } else {
      return list.slice(start, list.length);
    }
  };

  fn.join = function(list, separator) {
    return list.join(separator);
  };

  fn.match = function(str, reg) {
    return str.match(reg);
  };

  fn.matchAll = function(str, reg) {
    const re = new RegExp(reg, 'g');
    let match = re.exec(str);
    const matches = [];
    while (match !== null) {
      matches.push(match);
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      match = re.exec(str);
    }
    return matches;
  };

  fn.split = function(str, delim) {
    return str.split(delim);
  };

  fn.trim = function(str) {
    if (str instanceof Array) {
      return str.map(this.trim);
    } else {
      return str.trim();
    }
  };
}