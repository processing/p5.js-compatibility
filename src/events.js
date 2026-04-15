function addEvents(p5, fn) {
  p5.prototype.BACKSPACE = 8;
  p5.prototype.DELETE = 46;
  p5.prototype.ENTER = 13;
  p5.prototype.RETURN = 13;
  p5.prototype.TAB = 9;
  p5.prototype.ESCAPE = 27;
  p5.prototype.SHIFT = 16;
  p5.prototype.CONTROL = 17;
  p5.prototype.OPTION = 18;
  p5.prototype.ALT = 18;
  p5.prototype.UP_ARROW = 38;
  p5.prototype.DOWN_ARROW = 40;
  p5.prototype.LEFT_ARROW = 37;
  p5.prototype.RIGHT_ARROW = 39;

  const codeToKeyCode = {
    ArrowUp: 38,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
    ShiftLeft: 16,
    ShiftRight: 16,
    ControlLeft: 17,
    ControlRight: 17,
    AltLeft: 18,
    AltRight: 18,
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Escape: 27,
    Delete: 46,
  };

  const pressedKeyCodes = new Set();
  const oldOnKeyDown = fn._onkeydown;
  const oldOnKeyUp = fn._onkeyup;
  const oldKeyIsDown = fn.keyIsDown;

  fn._onkeydown = function (e) {
    const numericCode = e.keyCode || codeToKeyCode[e.code] || 0;
    this.keyCode = numericCode;
    if (numericCode !== 0) {
      pressedKeyCodes.add(numericCode);
    }

    if (typeof oldOnKeyDown === 'function') {
      oldOnKeyDown.call(this, e);
    }
  };

  fn._onkeyup = function (e) {
    const numericCode = e.keyCode || codeToKeyCode[e.code] || 0;
    this.keyCode = numericCode;
    if (numericCode !== 0) {
      pressedKeyCodes.delete(numericCode);
    }

    if (typeof oldOnKeyUp === 'function') {
      oldOnKeyUp.call(this, e);
    }
  };

  fn.keyIsDown = function (code) {
    if (typeof code === 'number') {
      return pressedKeyCodes.has(code);
    }

    if (typeof oldKeyIsDown === 'function') {
      return oldKeyIsDown.call(this, code);
    }
    return false;
  };
}

if (typeof p5 !== undefined) {
  p5.registerAddon(addEvents);
}
