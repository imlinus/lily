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

var Compile = function Compile (view, el) {
  this.view = view;
  this.el = el;
  
  this.init();
};

Compile.prototype.init = function init () {
  this.run = this.view.__proto__;
  // if (this.run.beforeMount) this.run.beforeMount()

  this.template = this.html(this.view.template);
  this.compileElement(this.template);

  if (this.el) {
    console.log('el', this.el);
    this.el.appendChild(this.template);
  }

  // if (this.run.mounted) this.run.mounted()
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

    if (this.isElementNode(child)) {
      this.compile(child);
    } else if (this.isTextNode(child) && regx.test(text)) {
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
  } else if (this.view.props) {
    var attrs = node.attributes;
    console.log(this.view, node);

    // for (let i = 0; i < attrs.length; i++) {
    // const attr = attrs[i]

    // if (this.isBindDirective(attr.name)) {
    //   const key = attr.name.substr(1)
    //   const val = attr.nodeValue
    //   console.log('isBindDirective', key, val, node)
    //   console.log(this.vm.props[exp])
    // }
    // }
  }
};

Compile.prototype.compile = function compile (node) {
  var attrs = node.attributes;

  // compile sub components
  if (this.view.components) {
    var component = this.view.components[node.localName];

    if (component) {
      var comp = new Compile(component, this.template);
      var parent = node.parentNode;

      // parent.removeChild(node) // remove component tag
      // parent.appendChild(comp.template) // add component html

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

    if (this.isModelDirective(attr.name)) {
      var tagName = node.tagName.toLowerCase();
      console.log('isModelDirective', tagName, node);
    } else if (this.isLoopDirective(attr.name)) {
      console.log('isLoopDirective', node);
    } else if (this.isEventDirective(attr.name)) {
      console.log('isEventDirective', node);
    } else if (this.isBindDirective(attr.name)) {
      var key = attr.name.substr(1);
      var val = attr.nodeValue;
      console.log('isBindDirective', key, val, node);
    }
  }
};

Compile.prototype.isElementNode = function isElementNode (node) {
  return node.nodeType === 1
};

Compile.prototype.isTextNode = function isTextNode (node) {
  return node.nodeType === 3
};

Compile.prototype.isModelDirective = function isModelDirective (val) {
  return val === 'model'
};

Compile.prototype.isLoopDirective = function isLoopDirective (val) {
  return val === 'loop'
};

Compile.prototype.isEventDirective = function isEventDirective (val) {
  return val.indexOf('@') !== -1
};

Compile.prototype.isBindDirective = function isBindDirective (val) {
  return val.startsWith(':')
};

var Lily = function Lily (app, el) {
  this.app = new app();
  this.el = (el instanceof HTMLElement ? el : el = document.body);

  this.defineReactive(this.app);
  new Compile(this.app, this.el);

  console.log(this.app);
};

Lily.prototype.defineReactive = function defineReactive (obj) {
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

Lily.prototype.proxyData = function proxyData (obj, key) {
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

Lily.prototype.get = function get (key) {
  return this.app[key]
};

Lily.prototype.set = function set (key, val) {
  this.app[key] = val;
};

module.exports = Lily;
