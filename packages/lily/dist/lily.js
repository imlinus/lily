'use strict';

var Dep = function Dep () {
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.notify = function notify () {
  for (var i = 0; i < this.subs.length; i++) {
    this.subs[i].update();
  }
};

var Watcher = function Watcher (vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;

  Dep.target = this;
  this.val = this.get();
};

Watcher.prototype.get = function get () {
  var val = this.vm[this.exp];
  Dep.target = null;

  return val
};

Watcher.prototype.update = function update () {
  var newVal = this.get();
  var oldVal = this.val;

  if (newVal === oldVal) { return }

  this.val = newVal;
  this.cb.call(this.vm, newVal, oldVal);
};

var elementNode = function (node) { return node.nodeType === 1; };
var textNode = function (node) { return node.nodeType === 3; };

var html = function (html) {
  if (!html) { return }

  var el = document.createElement('html');
  // const tmp = document.createElement('template')
  el.innerHTML = html.trim();

  return el.children[1].firstChild
  // return el.firstChild
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

var observe = function (data) {
  if (!data || typeof data !== 'object') { return }

  var keys = Object.keys(data);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    defineReactive(data, key, data[key]);
  }
};

var defineReactive = function (target, key, val) {
  var dep = new Dep();
  observe(val);

  Object.defineProperty(target, key, {
    configurable: false,
    enumerable: true,
    get: function get () {
      Dep.target && dep.addSub(Dep.target);
      return val
    },
    set: function set (newVal) {
      if (newVal === val) { return }
      val = newVal;
      dep.notify();
    }
  });
};

var Lily = function Lily (el) {
  this.el = (el && el instanceof HTMLElement ? el : el = document.body);
  if (this.data) { this.data = this.data(); }
  this.reactive(); 
  observe(this.data);
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

Lily.prototype.set = function set (key, val) {
  this.data[key] = val;
  // const key = Object.keys(data)[0]
  // const val = data[key]

  // if (val.constructor === Array) {
  // this.data()[key].concat(val)
  // console.log(this.data()[key], val, this.data()[key].concat(val))
  // } else if (val.constructor === Object) {
  // Object.assign(this.data[key], val)
  // } else {
  // this.data[key] = data[key]
  // }
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

Lily.prototype.config = {
  silent: false
};

module.exports = Lily;
