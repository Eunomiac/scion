var isFunction = require('./isFunction.js');

// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction(obj[key])) names.push(key);
  }
  return names.sort();
}

module.exports = functions;
