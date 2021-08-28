// https://github.com/tc39/proposal-iterator-helpers
var $ = require('../internals/export');
var path = require('../internals/path');
var aFunction = require('../internals/a-function');
var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
var getAsyncIterator = require('../internals/get-async-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var getMethod = require('../internals/get-method');
var wellKnownSymbol = require('../internals/well-known-symbol');
var AsyncFromSyncIterator = require('../internals/async-from-sync-iterator');

var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');

var AsyncIterator = path.AsyncIterator;

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise, arg, hasArg) {
  return anObject(this.next.apply(this.iterator, hasArg ? [arg] : []));
}, true);

$({ target: 'AsyncIterator', stat: true }, {
  from: function from(O) {
    var object = toObject(O);
    var usingIterator = getMethod(object[ASYNC_ITERATOR]);
    var iterator;
    if (usingIterator !== undefined) {
      iterator = getAsyncIterator(object);
      if (iterator instanceof AsyncIterator) return iterator;
    }
    if (iterator === undefined) {
      usingIterator = getIteratorMethod(object);
      if (usingIterator !== undefined) return new AsyncFromSyncIterator(aFunction(usingIterator).call(object));
    }
    return new AsyncIteratorProxy({
      iterator: iterator !== undefined ? iterator : object
    });
  }
});
