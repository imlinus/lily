var Lily = (function () {
  'use strict';

  ((function (global) {
    if (global.setImmediate) {
      return
    }

    var tasksByHandle = {};

    var nextHandle = 1; // Spec says greater than zero
    var currentlyRunningATask = false;
    var registerImmediate;

    function setImmediate(callback) {
      tasksByHandle[nextHandle] = callback;
      registerImmediate(nextHandle);
      return nextHandle++
    }

    function clearImmediate(handle) {
      delete tasksByHandle[handle];
    }

    function runIfPresent(handle) {
      // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
      // So if we're currently running a task, we'll need to delay this invocation.
      if (currentlyRunningATask) {
        // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
        // "too much recursion" error.
        setTimeout(runIfPresent, 0, handle);
      } else {
        var task = tasksByHandle[handle];
        if (task) {
          currentlyRunningATask = true;
          try {
            task();
          } finally {
            clearImmediate(handle);
            currentlyRunningATask = false;
          }
        }
      }
    }

    function installNextTickImplementation() {
      registerImmediate = function (handle) {
        process.nextTick(function () { runIfPresent(handle); });
      };
    }

    function installPostMessageImplementation() {
      // Installs an event handler on `global` for the `message` event: see
      // * https://developer.mozilla.org/en/DOM/window.postMessage
      // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
      var messagePrefix = "setImmediate$" + (Math.random()) + "$";
      var onGlobalMessage = function (event) {
        if (event.source === global &&
                  typeof event.data === 'string' &&
                  event.data.indexOf(messagePrefix) === 0) {
          runIfPresent(+event.data.slice(messagePrefix.length));
        }
      };

      global.addEventListener('message', onGlobalMessage, false);

      registerImmediate = function (handle) {
        global.postMessage(messagePrefix + handle, '*');
      };
    }

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === '[object process]') {
      // For Node.js before 0.9
      installNextTickImplementation();
    } else {
      // For non-IE10 modern browsers
      installPostMessageImplementation();
    }

    global.setImmediate = setImmediate;
    global.clearImmediate = clearImmediate;

  }))(typeof self === 'undefined' ? typeof global === 'undefined' ? window : global : self);

  // TODO: Rebuild this one, also. wtfck is the set-immediate crap

  var watchers = new WeakMap();
  var dispatch = Symbol();
  var isWatching = Symbol();
  var timer = Symbol();
  var isArray = Symbol();
  var changes = Symbol();

  var API = {
    watch: function watch (fn) {
      if (typeof fn !== 'function') { throw "Sorry" }

      if (!watchers.has(this)) { watchers.set(this, []); }
      watchers.get(this).push(fn);

      return this
    },

    unwatch: function unwatch (fn) {
      var callbacks = watchers.get(this);
      if (!callbacks) { return }

      if (fn) {
        var index = callbacks.indexOf(fn);
        if (~index) { callbacks.splice(index, 1); }
      } else { watchers.set(this, []); }

      return this
    },

    json: function json () {
      var this$1 = this;

      return Object.keys(this).reduce(function (ret, key) {
        var value = this$1[key];
        ret[key] = value && value.json ? value.json() : value;
        return ret
      }, this[isArray] ? [] : {})
    }
  };

  var TRAPS = {
    set: function set (target, property, value) {
      if (target[property] !== value) {
        if (
          value === Object(value) &&
          !value[isWatching]
        ) {
          target[property] = icaro(value);
        } else {
          target[property] = value;
        }

        target[dispatch](property, value);
      }

      return true
    }
  };

  var define = function (obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: false,
      configurable: false,
      writable: false
    });
  };

  var enhance = function (obj) {
    var obj$1;

    Object.assign(obj, ( obj$1 = {}, obj$1[changes] = new Map(), obj$1[timer] = null, obj$1[isWatching] = true, obj$1[dispatch] = function (property, value) {
        if (watchers.has(obj)) {
          clearImmediate(obj[timer]);
          obj[changes].set(property, value);
          obj[timer] = setImmediate(function () {
            watchers.get(obj).forEach(function (fn) { return fn(obj[changes]); });
            obj[changes].clear();
          });
        }
      }, obj$1 ));

    Object.keys(API).forEach(function (key) {
      define(obj, key, API[key].bind(obj));
    });

    if (Array.isArray(obj)) {
      obj[isArray] = true;
      obj.forEach(function (item, i) {
        obj[i] = null;
        TRAPS.set(obj, i, item);
      });
    }

    return obj
  };

  var observe = function (obj) {
    return new Proxy(
      enhance(obj || {}),
      Object.create(TRAPS)
    )
  };

  var is = {
    elementNode: function (node) { return node.nodeType === 1; },
    textNode: function (node) { return node.nodeType === 3; },
    obj: function (obj) { return obj != null && typeof obj === 'object'; },
    arr: function (arr) { return Array.isArray(arr); }
  };

  var Compiler = function Compiler (vm) {
    this.vm = vm;
    var hooks = this.vm.__proto__;

    if (hooks.beforeMount) { hooks.beforeMount(); }

    if (this.vm.components) { this.components = this.vm.components(); }
    if (this.vm.template) { this.template = this.html(this.vm.template()); }

    this.walkNodes(this.template);
    this.nodes(this.template);

    if (hooks.mounted) { hooks.mounted(); }

    return this.template
  };

  Compiler.prototype.html = function html (html$1) {
    if (!html$1) { return }
    
    var el = document.createElement('html');
    el.innerHTML = html$1.trim();
    
    return el.children[1].firstChild
  };

  Compiler.prototype.nodes = function nodes (el) {
    var nodes = el.parentNode.querySelectorAll('*');

    for (var i = 0; i < nodes.length; i++) {
      this.checkAttrs(nodes[i].attributes);
    }
  };

  Compiler.prototype.checkAttrs = function checkAttrs (nodes) {
      var this$1 = this;

    return Object.values(nodes).reduce(function (n, attr) {
      var el = attr.ownerElement;
      var key = attr.nodeValue;
      var exp = attr.nodeName;

      if (/model/.test(exp)) { return this$1.model(el, key, exp) }
      if (/@/.test(exp)) { return this$1.on(el, key, exp) }
      if (/loop/.test(exp)) { return this$1.loop(el, key, exp) }
    }, [])
  };

  Compiler.prototype.walkNodes = function walkNodes (node) {
    if (!node) { return }

    var childs = node.childNodes;

    for (var i = 0; i < childs.length; i++) {
      var child = childs[i];
      var regx = /\{\{(.*)\}\}/;
      var text = child.textContent;

      if (regx.test(text)) {
        this.text(child, regx.exec(text)[1].trim());
      }

      if (is.elementNode(child)) {
        if (this.components && this.components.hasOwnProperty(child.localName)) {
          var Child = this.components[child.localName];
          new Child(child);
        }
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.walkNodes(child);
      }
    }
  };

  Compiler.prototype.text = function text (node, exp) {
    var text = this.vm.data[exp];
    node.textContent = text;

    this.vm.data.watch(function (changes) {
      node.textContent = changes.get(exp);
    });
  };

  Compiler.prototype.on = function on (el, key, exp) {
      var this$1 = this;

    var evt = exp.substr(1);

    el.addEventListener(evt, function () {
      if (this$1.vm[key]) { this$1.vm[key](event); }
    });
  };

  Compiler.prototype.model = function model (el, key, exp) {
      var this$1 = this;

    el.addEventListener('input', function () {
      this$1.vm.data[key] = el.value;
    });
    
    return el.value = this.vm.data[key]
  };

  Compiler.prototype.loop = function loop (el, key, exp) {
    var name = key.split('in')[1].replace(/\s/g, '');
    var arr = this.vm.data[name];
    var p = el.parentNode;

    p.removeChild(el);

    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var node = document.createElement(el.localName);

      node.textContent = item;
      p.appendChild(node);
    }
  };

  var compiler = function (vm) { return new Compiler(vm); };

  var Lily = function Lily (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body);
    if (this.data()) { this.data = observe(this.data()); }
    this.template = compiler(this);
    this.render();
    console.log(this);
  };

  Lily.prototype.render = function render () {
    this.el.localName === 'body'
      ? this.el.appendChild(this.template)
      : this.el.parentNode.replaceChild(this.template, this.el);
  };

  Lily.mount = function mount (app) {
    return new app()
  };

  return Lily;

}());
