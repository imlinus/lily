var lyex = (function () {
  'use strict';

  var store = {};

  var lyex = {
    get: function get (key) {
      return !store[key] ? undefined : store[key].val
    },

    set: function set (key, val) {
      var currVal = undefined;

      if (!store[key]) {
        store[key] = {
          val: val,
          subs: []
        };
      } else {
        currVal = store[key].val;
        store[key].val = val;
      }

      callSubs(key, val, currVal);
    },

    listen: function listen (key, cb, opts) {
      if ( opts === void 0 ) opts = {};

      var i = 1;

      if (!store[key]) {
        store[key] = {
          val: undefined,
          subs: [cb]
        };
      } else {
        i = store[key].subs.push(cb);
      }

      if (opts.callback) { cb(this.get(key)); }

      return function () {
        delete store[key].subs[i - 1];
      }
    }
  };

  var callSubs = function (key, newVal, oldVal) {
    var subs = store[key].subs;

    for (var i = 0; i < subs.length; i++) {
      var cb = subs[i];
      if (cb.constructor === Function) { cb(newVal, oldVal); }
    }
  };

  return lyex;

}());
