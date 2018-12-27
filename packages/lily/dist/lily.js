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

var Watcher = function Watcher (view, exp, cb) {
  this.view = view;
  this.exp = exp;
  this.cb = cb;

  Dep.target = this;
  this.val = this.get();
};

Watcher.prototype.get = function get () {
  var val = this.view[this.exp];
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

var Compile = function Compile (view) {
  this.view = view;
  var hooks = this.view.__proto__;

  if (hooks.beforeMount) { hooks.beforeMount(); }

  if (this.view.components) {
    this.components = this.view.components();
  }

  if (this.view.template) {
    this.template = html(this.view.template());
  }

  this.walkNodes(this.template);
  this.nodes(this.template);

  if (hooks.mounted) { hooks.mounted(); }

  // console.log(this)
};

Compile.prototype.nodes = function nodes (el) {
  var nodes = el.parentNode.querySelectorAll('*');

  for (var i = 0; i < nodes.length; i++) {
    this.bindMethods(nodes[i].attributes);
  }
};

Compile.prototype.bindMethods = function bindMethods (nodes) {
    var this$1 = this;

  return Object.values(nodes).reduce(function (n, attr) {
    var method = attr.nodeName;
    var key = attr.nodeValue;
    var el = attr.ownerElement;

    if (/:style/.test(method)) { return this$1.style(el, key, method) }
    if (/bind/.test(method)) { return this$1.bind(el, key, method) }
    if (/@/.test(method)) { return this$1.on(el, key, method) }
    if (/loop/.test(method)) { return this$1.loop(el, key, method) }
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
      if (this.components && this.components.hasOwnProperty(child.localName)) {
        var Component = this.components[child.localName];
        new Component(child);
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
  if (this.view.data) {
    var text = this.view.data[exp];
    node.textContent = text;

    new Watcher(this.view, exp, function (val) {
      node.textContent = val ? val : '';
    });
  }
};

Compile.prototype.on = function on (el, key, method) {
    var this$1 = this;

  var evt = method.substr(1);

  el.addEventListener(evt, function () {
    if (this$1.view[key]) { this$1.view[key](event); }
  });
};

Compile.prototype.loop = function loop (el, key, method) {
  var itemName = key.split('in')[0].replace(/\s/g, '');
  var arrName = key.split('in')[1].replace(/\s/g, '');
  var arr = this.view.data[arrName];
  var parent = el.parentNode;

  parent.removeChild(el);

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    var $el = document.createElement(el.localName);

    $el.textContent = item;
    parent.appendChild($el);
  }
};

Compile.prototype.bind = function bind (el, key, method) {
    var this$1 = this;

  el.addEventListener('input', function () {
    this$1.view.data[key] = el.value;
  });

  new Watcher(this.view, method, function (val) {
    el.value = val;
  });

  return el.value = this.view.data[key]
};

Compile.prototype.style = function style (el, key, method) {
  var className = this.view.data[key];
  el.classList.add(className);
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
  this.template = new Compile(this).template;
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

Lily.mount = function mount (component) {
  return new component()
};

Lily.prototype.config = {
  silent: false
};

module.exports = Lily;
