var REVEAL_ADD_DEEP_CALLBACK = '__REVEAL_ADD_DEEP_CALLBACK__';
var REVEAL_ADD_FLAT_CALLBACK = '__REVEAL_ADD_FLAT_CALLBACK__';
var REVEAL_REMOVE_DEEP_CALLBACK = '__REVEAL_REMOVE_DEEP_CALLBACK__';
var REVEAL_REMOVE_FLAT_CALLBACK = '__REVEAL_REMOVE_FLAT_CALLBACK__';

function observe (target, emit) {
  var proxies = {};

  var flatCallbaks = [];
  var deepCallbaks = [];

  return new Proxy(target || {}, {
    get: function get (obj, prop, receiver) {
      var reflected = Reflect.get.apply(Reflect, arguments);

      if (typeof reflected === 'object' || typeof reflected === 'undefined') {
        return proxies[prop] || (
          proxies[prop] = observe(reflected || {}, function (eObj, eOldObj, eProp) {
            var obj$1, obj$2;

            var oldValue = Object.assign({}, obj,
              ( obj$1 = {}, obj$1[prop] = eOldObj, obj$1 ));
            var newValue = Object.assign({}, obj,
              ( obj$2 = {}, obj$2[prop] = eObj, obj$2 ));

            if (deepCallbaks.length) {
              deepCallbaks.forEach(function (c) { return c(newValue, oldValue, prop + '.' + eProp); });
            }

            if (typeof emit === 'function') {
              emit(newValue, oldValue, prop + '.' + eProp);
            }
          })
        )
      }

      return reflected
    },
    set: function set (obj, prop, value) {
      if (prop === REVEAL_ADD_FLAT_CALLBACK) {
        return flatCallbaks.push(value)
      }

      if (prop === REVEAL_ADD_DEEP_CALLBACK) {
        return deepCallbaks.push(value)
      }

      if (prop === REVEAL_REMOVE_FLAT_CALLBACK) {
        return flatCallbaks = flatCallbaks.filter(function (c) { return c !== value; })
      }

      if (prop === REVEAL_REMOVE_DEEP_CALLBACK) {
        return deepCallbaks = deepCallbaks.filter(function (c) { return c !== value; })
      }

      var oldValue = obj[prop];
      var oldObj = Object.assign({}, obj);

      var reflected = Reflect.set.apply(Reflect, arguments);

      if (reflected && (value !== oldValue)) {
        if (flatCallbaks.length) {
          flatCallbaks.forEach(function (c) { return c(obj, oldObj, prop); });
        }
        if (deepCallbaks.length) {
          deepCallbaks.forEach(function (c) { return c(obj, oldObj, prop); });
        }
        if (typeof emit === 'function') {
          emit(obj, oldObj, prop);
        }
      }

      return reflected
    }
  })
}

function watcher (target, handler, options) {
  options = Object.assign({}, {deep: false,
    immediate: false},
    options);

  var props = options.deep
    ? { add: REVEAL_ADD_DEEP_CALLBACK, remove: REVEAL_REMOVE_DEEP_CALLBACK }
    : { add: REVEAL_ADD_FLAT_CALLBACK, remove: REVEAL_REMOVE_FLAT_CALLBACK };

  target[props.add] = handler;

  if (options.immediate) {
    handler(target);
  }

  return function revoke () {
    target[props.remove] = handler;
  }
}

var Compiler = function Compiler (vm) {
  var data = vm.data;
  var components = vm.components;
  var template = vm.template;

  this.vm = vm;
  var hooks = this.vm.__proto__;

  if (hooks.beforeMount) { hooks.beforeMount(); }
  if (data) { this.data = data; }
  if (components) { this.components = components(); }
  if (template) { this.template = this.html(template()); }

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

Compiler.prototype.walkNodes = function walkNodes (node) {
    var this$1 = this;

  if (!node) { return }

  node.childNodes.forEach(function (child) {
    var regx = /\{\{(.*)\}\}/;
    var text = child.textContent;

    if (regx.test(text)) {
      this$1.text(child, regx.exec(text)[1].trim());
    }

    if (child.nodeType === 1) {
      if (this$1.components && this$1.components.hasOwnProperty(child.localName)) {
        var Child = this$1.components[child.localName];
        new Child(child);
      }
    }

    if (child.childNodes && child.childNodes.length !== 0) {
      this$1.walkNodes(child);
    }
  });
};

Compiler.prototype.nodes = function nodes (el) {
    var this$1 = this;

  el.parentNode.querySelectorAll('*')
    .forEach(function (node) { return this$1.checkAttrs(node.attributes); });
};

Compiler.prototype.checkAttrs = function checkAttrs (els) {
    var this$1 = this;

  return Object.values(els).reduce(function (n, attr) {
    var data = { el: attr.ownerElement, key: attr.nodeValue, exp: attr.nodeName };
    var el = data.el;
      var key = data.key;
      var exp = data.exp;

    if (/model/.test(exp)) { return this$1.model(el, key, exp) }
    if (/@/.test(exp)) { return this$1.on(el, key, exp) }
    if (/loop/.test(exp)) { return this$1.loop(el, key, exp) }
  }, [])
};

Compiler.prototype.text = function text (node, exp) {
  var text = this.data[exp];
  if (text.constructor !== Object) { node.textContent = text; }

  watcher(this.data, function (data) {
    node.textContent = data[exp];
  });
};

Compiler.prototype.model = function model (el, key, exp) {
    var this$1 = this;

  el.addEventListener('input', function () {
    this$1.data[key] = el.value;
  });

  return el.value = this.data[key].constructor === Object
    ? ''
    : this.data[key]
};

Compiler.prototype.on = function on (el, key, exp) {
    var this$1 = this;

  var evt = exp.substr(1);

  el.addEventListener(evt, function () {
    if (this$1.vm[key]) { this$1.vm[key](event); }
  });
};

Compiler.prototype.loop = function loop (el, key, exp) {
  var name = key.split('in')[1].replace(/\s/g, '');
  var arr = this.data[name];
  var p = el.parentNode;

  p.removeChild(el);

  var replace = function (item) {
    var node = document.createElement(el.localName);
    node.textContent = item;
    p.appendChild(node);
  };

  arr.forEach(function (item) { return replace(item); });

  watcher(this.data, function (data) {
    data[name].forEach(function (item) { return replace(item); });
  });
};

var compile = function (vm) { return new Compiler(vm); };

var Lily = function Lily (el) {
  this.el = (el && el instanceof HTMLElement ? el : el = document.body);
  this.data = observe(this.data());
  this.template = compile(this);
  this.render();
};

Lily.prototype.render = function render () {
  this.el.localName === 'body'
    ? this.el.appendChild(this.template)
    : this.el.parentNode.replaceChild(this.template, this.el);
};

Lily.mount = function mount (app) {
  return new app()
};

export default Lily;
