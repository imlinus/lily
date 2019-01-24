var is = {
  elementNode: function (node) { return node.nodeType === 1; },
  textNode: function (node) { return node.nodeType === 3; },
  obj: function (obj) { return obj != null && typeof obj === 'object'; },
  arr: function (arr) { return Array.isArray(arr); }
};

var getObj = function (obj, root) {
  if ( root === void 0 ) root = {};

  if (!obj || is.obj(obj)) { return obj }
  var clone = JSON.parse(JSON.stringify(obj));

  for (var i in clone) {
    if (typeof clone[i] !== 'object') { root[i] = clone[i]; }
    else if (typeof clone[i] === 'object' && typeof clone[i].___value !== 'undefined') { root[i] = clone[i].___value; }
    else if (is.arr(clone[i])) { root[i] = clone[i].splice(0); }
    else if (typeof clone[i] === 'object') { root[i] = getObj(clone[i], {}); }
  }

  return root
};

var watch = function (obj, oldObj, target, name, val) {
  if (obj && obj.watch && typeof obj.watch === 'function') {
    obj.watch(getObj(obj), getObj(target), name, val);
  }
};

var handler = function (data) {
  return {
    get: function (target, prop, receiver) { return target[prop]; },

    deleteProperty: function (target, property) {
      var deleted;
      var oldVal = getObj(data);

      if (is.obj(target) || is.arr(target)) { deleted = delete target[property]; }

      watch(data, oldVal, target, property);
      return deleted
    },

    set: function (target, name, val) {
      var oldVal = getObj(data);

      if (is.arr(target) && name === 'length') {
        target[name] = val;
        return target
      }

      if (is.arr(val)) { target[name] = new Proxy(val, handler); }
      if (is.obj(val) && !is.arr(val)) { target[name] = new Observer(val, {}, data); }
      if (!is.obj(val)) { target[name] = val; }

      watch(data, oldVal, target, name, val);

      return target
    }
  }
};

var Observer = function Observer (obj, data, orgObj) {
  if (is.obj(obj) && !is.arr(obj)) {
    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {
      if (typeof obj[keys[i]] === 'object') { data[keys[i]] = new Observer(obj[keys[i]], {}, orgObj); }
      else { data[keys[i]] = obj[keys[i]]; }
    }

    return new Proxy(data, handler(orgObj || obj))
  }

  if (is.arr(obj)) { return new Proxy(obj, handler(orgObj|| obj)) }
  if (!is.obj(obj)) { return obj }
};

var observe = function (obj) {
  var newState = {};

  try {
    return new Observer(obj, newState, newState)
  } catch (e) {
    return obj
  }
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

  this.vm.data.watch = function (data) {
    node.textContent = data[exp];
  };
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

var compiler = function (vm) { return new Compiler(vm); };

var Lily = function Lily (el) {
  this.el = (el && el instanceof HTMLElement ? el : el = document.body);
  this.data = observe(this.data());
  this.template = compiler(this);
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
