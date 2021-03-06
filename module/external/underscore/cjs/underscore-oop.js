var _setup = require('./_setup.js');
var underscore = require('./underscore.js');
var _chainResult = require('./_chainResult.js');
var each = require('./each.js');

// Add all mutator `Array` functions to the wrapper.
each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  var method = _setup.ArrayProto[name];
  underscore.prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
        delete obj[0];
      }
    }
    return _chainResult(this, obj);
  };
});

// Add all accessor `Array` functions to the wrapper.
each(['concat', 'join', 'slice'], function(name) {
  var method = _setup.ArrayProto[name];
  underscore.prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return _chainResult(this, obj);
  };
});

// Extracts the result from a wrapped and chained object.
underscore.prototype.value = function() {
  return this._wrapped;
};

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
underscore.prototype.valueOf = underscore.prototype.toJSON = underscore.prototype.value;

underscore.prototype.toString = function() {
  return String(this._wrapped);
};

module.exports = underscore;
