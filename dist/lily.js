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

var Watcher = function Watcher (view, expr, cb) {
  this.view = view;
  this.expr = expr;
  this.cb = cb;

  Dep.target = this;
  this.val = this.get();
};

Watcher.prototype.get = function get () {
  var val = this.view[this.expr];
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

var config = {
  silent: false,
  symbols: {
    bind: ':',
    event: '@',
    loop: 'loop',
    model: 'bind'
  }
};

var elementNode = function (node) { return node.nodeType === 1; };
var textNode = function (node) { return node.nodeType === 3; };

var Compile = function Compile (view) {
  this.view = view;
  var hooks = this.view.__proto__;

  if (hooks.beforeMount) { hooks.beforeMount(); }

  if (this.view.components) {
    this.components = this.view.components();
  }

  if (this.view.template) {
    this.template = this.html(this.view.template());
  }

  this.walkNodes(this.template);
  this.nodes(this.template);

  if (hooks.mounted) { hooks.mounted(); }
};

Compile.prototype.html = function html (html$1) {
  var template = document.createElement('template');
  template.innerHTML = html$1.trim();

  return template.content.firstChild
};

Compile.prototype.nodes = function nodes (el) {
  var nodes = el.querySelectorAll('*');

  for (var i = 0; i < nodes.length; i++) {
    this.bindMethods(nodes[i].attributes);
  }
};

Compile.prototype.bindMethods = function bindMethods (nodes) {
    var this$1 = this;

  return Object.values(nodes).reduce(function (n, attr) {
    var method = attr.nodeName;
    var val = attr.nodeValue;
    var el = attr.ownerElement;

    if (new RegExp(config.symbols.model).test(method)) { return this$1.model(el, val, method) }
    if (new RegExp(config.symbols.event).test(method)) { return this$1.on(el, val, method) }
    if (new RegExp(config.symbols.loop).test(method)) { return this$1.for(el, val, method) }
  }, [])
};

Compile.prototype.walkNodes = function walkNodes (node) {
  var childs = node.childNodes;

  for (var i = 0; i < childs.length; i++) {
    var child = childs[i];
    var regx = /\{\{(.*)\}\}/;
    var text = child.textContent;

    if (elementNode(child)) ; else if (textNode(child) && regx.test(text)) {
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

    new Watcher(this.view, exp, function (newVal) {
      node.textContent = newVal ? newVal : '';
    });
  }
};

Compile.prototype.on = function on (el, key, method) {
    var this$1 = this;

  var evt = method.substr(1);
  el.addEventListener(evt, function () { return this$1.view[key](event); });
};

Compile.prototype.for = function for$1 (el, val, method) {
  console.log('loop', el, val, method);
};

Compile.prototype.model = function model (el, key, method) {
    var this$1 = this;

  el.addEventListener('input', function () {
    this$1.view.data[key] = el.value;
  });

  new Watcher(this.view, method, function (newVal) {
    el.value = newVal;
  });

  return el.value = this.view.data[key]
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

var html = function (html) {
  var tmp = document.createElement('template');
  tmp.innerHTML = html.trim();

  return tmp.content.firstChild
};

var Lily = function Lily (el) {
  this.el = (el && html(el) instanceof HTMLElement ? el = html(el) : el = document.body);
  if (this.data) { this.data = this.data(); }
  this.defineReactive();
  observe(this.data);
  this.template = new Compile(this).template;
  this.render();
};

Lily.prototype.render = function render () {
  this.el.appendChild(this.template);
};

Lily.prototype.get = function get (key) {
  return this.data[key]
};

Lily.prototype.set = function set (key, val) {
  this.data[key] = val;
};

Lily.prototype.defineReactive = function defineReactive () {
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

Lily.prototype.config = config;

module.exports = Lily;
