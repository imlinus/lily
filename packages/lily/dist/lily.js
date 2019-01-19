'use strict';

var Dep = function Dep () {
  this.subs = new Map();
};

Dep.prototype.addSub = function addSub (key, sub) {
  var curr = this.subs.get(key);

  if (curr) { curr.add(sub); }
  else { this.subs.set(key, new Set([sub])); }
};

Dep.prototype.notify = function notify (key) {
  if (this.subs.get(key)) {
    this.subs.get(key).forEach(function (sub) { return sub.update(); });
  }
};

var q = new Set();

var nextTick = function (cb) {
  Promise.resolve().then(cb);
};

var flush = function (args) {
  q.forEach(function (watcher) { return watcher.run(); });
  q = new Set();
};

var queue = function (watcher) {
  q.add(watcher);
  nextTick(flush);
};

var Watcher = function Watcher (vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();
};

Watcher.prototype.get = function get () {
  var exp = this.exp;
  var val;
  Dep.target = this;

  if (typeof exp === 'function') {
    val = exp.call(this.vm);
  } else if (typeof exp === 'string') {
    val = this.vm[exp];
  }
  
  Dep.target = null;
  return val
};

Watcher.prototype.update = function update () {
  queue(this);
};

Watcher.prototype.run = function run () {
  var val = this.get();
  this.cb.call(this.vm, val, this.value);
  this.value = val;
};

// import Dep from './dep.js'

// class Watcher {
//   constructor (vm, exp, cb) {
//     this.vm = vm
//     this.exp = exp
//     this.cb = cb

//     Dep.target = this
//     this.val = this.get()
//   }

//   get () {
//     const val = this.vm[this.exp]
//     Dep.target = null

//     return val
//   }

//   update () {
//     const newVal = this.get()
//     const oldVal = this.val

//     if (newVal === oldVal) return

//     this.val = newVal
//     this.cb.call(this.vm, newVal, oldVal)
//   }
// }

// export default Watcher

var elementNode = function (node) { return node.nodeType === 1; };
var textNode = function (node) { return node.nodeType === 3; };

var html = function (html) {
  if (!html) { return }

  var el = document.createElement('html');
  el.innerHTML = html.trim();

  return el.children[1].firstChild
};

var Compile = function Compile (vm) {
  this.vm = vm;
  var hooks = this.vm.__proto__;

  if (hooks.beforeMount) { hooks.beforeMount(); }

  if (this.vm.components) {
    this.c = this.vm.components();
  }

  if (this.vm.template) {
    this.t = html(this.vm.template());
  }

  this.walkNodes(this.t);
  this.nodes(this.t);

  if (hooks.mounted) { hooks.mounted(); }
};

Compile.prototype.nodes = function nodes (el) {
  var nodes = el.parentNode.querySelectorAll('*');

  for (var i = 0; i < nodes.length; i++) {
    this.check(nodes[i].attributes);
  }
};

Compile.prototype.check = function check (nodes) {
    var this$1 = this;

  return Object.values(nodes).reduce(function (n, attr) {
    var fn = attr.nodeName;
    var key = attr.nodeValue;
    var el = attr.ownerElement;

    if (/:style/.test(fn)) { return this$1.style(el, key, fn) }
    if (/bind/.test(fn)) { return this$1.bind(el, key, fn) }
    if (/@/.test(fn)) { return this$1.on(el, key, fn) }
    if (/loop/.test(fn)) { return this$1.loop(el, key, fn) }
  }, [])
};

Compile.prototype.walkNodes = function walkNodes (node) {
  if (!node) { return }

  var childs = node.childNodes;

  for (var i = 0; i < childs.length; i++) {
    var child = childs[i];
    var regx = /\{\{(.*)\}\}/;
    var text = child.textContent;

    if (elementNode(child)) {
      if (this.c && this.c.hasOwnProperty(child.localName)) {
        var C = this.c[child.localName];
        new C(child);
      }
    } else if (textNode(child) && regx.test(text)) {
      this.compileText(child, regx.exec(text)[1].trim());
    }

    if (child.childNodes && child.childNodes.length !== 0) {
      this.walkNodes(child);
    }
  }
};

Compile.prototype.compileText = function compileText (node, exp) {
  if (this.vm.data) {
    var text = this.vm.data[exp];
    node.textContent = text;

    new Watcher(this.vm, exp, function (val) {
      node.textContent = val ? val : '';
    });
  }
};

Compile.prototype.on = function on (el, key, fn) {
    var this$1 = this;

  var evt = fn.substr(1);

  el.addEventListener(evt, function () {
    if (this$1.vm[key]) { this$1.vm[key](event); }
  });
};

Compile.prototype.loop = function loop (el, key, fn) {
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

Compile.prototype.bind = function bind (el, key, fn) {
    var this$1 = this;

  el.addEventListener('input', function () {
    this$1.vm.data[key] = el.value;
  });

  new Watcher(this.vm, fn, function (val) {
    el.value = val;
  });

  return el.value = this.vm.data[key]
};

Compile.prototype.style = function style (el, key, fn) {
  var name = this.vm.data[key];
  el.classList.add(name);
};

var Observer = function (obj) {
  var dep = new Dep();

  return new Proxy(obj, {
    get: function get (target, key, receiver) {
      if (Dep.target) { dep.addSub(key, Dep.target); }

      return Reflect.get(target, key, receiver)
    },

    set: function set (target, key, value, receiver) {
      if (Reflect.get(receiver, key) === value) { return }
  
      var res = Reflect.set(target, key, observ(value), receiver);
      dep.notify(key);

      return res
    }
  })
};

var observ = function (obj) {
  if (!Object.prototype.toString.call(obj) === '[object Object]') { return obj }

  Object.keys(obj).forEach(function (key) {
    obj[key] = observ(obj[key]);
  });

  return Observer(obj)
};

var Lily = function Lily (el) {
  this.el = (el && el instanceof HTMLElement ? el : el = document.body);
  if (this.data) { this.data = observ(this.data()); }
  this.reactive(); 
  this.template = new Compile(this).t;
  this.render();
  console.log(this);
};

Lily.prototype.render = function render () {
  this.el.localName === 'body'
    ? this.el.appendChild(this.template)
    : this.el.parentNode.replaceChild(this.template, this.el);
};

Lily.prototype.get = function get (key) {
  return this.data[key]
};

Lily.prototype.set = function set (data) {
  this.data[key] = val;
};

Lily.prototype.reactive = function reactive () {
    var this$1 = this;

  var keys = Object.keys(this.data);

  var loop = function ( i ) {
    var key = keys[i];

    Object.defineProperty(this$1, key, {
      configurable: false,
      enumerable: true,
      get: function get () {
        return this.data[key]
      },
      set: function set (val) {
        this.data[key] = val;
      }
    });
  };

    for (var i = 0; i < keys.length; i++) loop( i );
};

Lily.mount = function mount (c) {
  return new c()
};

Lily.use = function use (p) {
  return new p()
};

Lily.prototype.config = {
  silent: false
};

module.exports = Lily;
