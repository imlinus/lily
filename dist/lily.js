'use strict';

var Watcher = function Watcher (vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.val = this.get();
};

Watcher.prototype.update = function update () {
  var oldVal = this.val;
  var newVal = this.vm.data[this.exp];
  if (oldVal === newVal) { return }

  this.val = newVal;
  this.cb.call(this.vm, newVal);
};

Watcher.prototype.get = function get () {
  var val = this.vm.data[this.exp];

  return val
};

var config = {
  silent: false,
  symbols: {
    bind: ':',
    event: '@',
    loop: 'loop',
    model: 'model'
  }
};

var elementNode = function (node) { return node.nodeType === 1; };
var textNode = function (node) { return node.nodeType === 3; };

var modelDirective = function (val) { return val === config.symbol.model; };
var loopDirective = function (val) { return val === config.symbol.loop; };
var eventDirective = function (val) { return val.indexOf(config.symbol.event) !== -1; };
var bindDirective = function (val) { return val.startsWith(config.symbol.bind); };

var Compile = function Compile (view, el) {
  this.view = view;
  this.el = el;
  
  this.init();
};

Compile.prototype.init = function init () {
  this.run = this.view.__proto__;
  if (this.run.beforeMount) { this.run.beforeMount(); }

  this.template = this.html(this.view.template);
  this.compileElement(this.template);

  if (this.el) {
    this.el.appendChild(this.template);
  }

  if (this.run.mounted) { this.run.mounted(); }
};

Compile.prototype.html = function html (html$1) {
  var template = document.createElement('template');
  template.innerHTML = html$1.trim();

  return template.content.firstChild
};

Compile.prototype.compileElement = function compileElement (node) {
  var childs = node.childNodes;

  for (var i = 0; i < childs.length; i++) {
    var child = childs[i];
    var regx = /\{\{(.*)\}\}/;
    var text = child.textContent;

    if (elementNode(child)) {
      this.compile(child);
    } else if (textNode(child) && regx.test(text)) {
      this.compileText(child, regx.exec(text)[1].trim());
    }

    if (child.childNodes && child.childNodes.length !== 0) {
      this.compileElement(child);
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

Compile.prototype.compile = function compile (node) {
  if (this.view.components) {
    var component = this.view.components[node.localName];

    if (component) {
      var comp = new Compile(component, this.template);
      this.checkAttrs(node);
    }
  } else {
    this.checkAttrs(node);
  }
};

Compile.prototype.checkAttrs = function checkAttrs (node) {
  var attrs = node.attributes;

  // check attributes
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];

    if (modelDirective(attr.name)) {
      var tagName = node.tagName.toLowerCase();
      console.log('isModelDirective', tagName, node);
    } else if (loopDirective(attr.name)) {
      console.log('isLoopDirective', node);
    } else if (eventDirective(attr.name)) {
      console.log('isEventDirective', node);
    } else if (bindDirective(attr.name)) {
      var key = attr.name.substr(1);
      var val = attr.nodeValue;
      console.log('isBindDirective', key, val, node);
    }
  }
};

var welcome = function (obj) {
  var title = '🌷 Lily.js';
  var info = 'More info:';
  var link = 'https://github.com/imlinus/lily';
  var css = {
    title: ['color: white', 'font-size: 1.5rem', 'font-weight: bold', 'padding: 0.675rem 0 0.475rem'].join(';'),
    info: ['color: white', 'font-size: 0.75rem', 'padding: 0'].join(';'),
    link: ['color: white', 'font-size: 0.75rem', 'padding: 0.25rem 0 0.675rem'].join(';')
  };

  if (!Lily$1.prototype.config.silent) {
    console.log(("%c" + (title.trim()) + "\n%c" + (info.trim()) + "\n%c" + (link.trim()) + "\n"), css.title, css.info, css.link, obj);
  }
};

var Lily$1 = function Lily (app, el) {
  welcome(this);
  this.app = new app();
  this.el = (el instanceof HTMLElement ? el : el = document.body);

  this.defineReactive(this.app);
  new Compile(this.app, this.el);

  console.log(this);
};

Lily$1.prototype.defineReactive = function defineReactive (obj) {
  for (var i$2 = 0, list$2 = Object.entries(obj); i$2 < list$2.length; i$2 += 1) {
    var ref = list$2[i$2];
      var key = ref[0];
      var val = ref[1];

      if (key === 'data') {
      for (var i = 0, list = Object.keys(val); i < list.length; i += 1) {
        var data = list[i];

          this.proxyData(obj, data);
      }
    } else if (key === 'components') {
      for (var i$1 = 0, list$1 = Object.entries(val); i$1 < list$1.length; i$1 += 1) {
        var component = list$1[i$1];

          this.defineReactive(component[1]);
      }
    }
  }
};

Lily$1.prototype.proxyData = function proxyData (obj, key) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    get: function get () {
      return obj.data[key]
    },
    set: function set (val) {
      obj.data[key] = val;
    }
  });
};

Lily$1.prototype.get = function get (key) {
  return this.app[key]
};

Lily$1.prototype.set = function set (key, val) {
  this.app[key] = val;
};

Lily$1.prototype.config = config;

module.exports = Lily$1;
