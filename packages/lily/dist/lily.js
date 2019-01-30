((function (global) {
  if (global.setImmediate) {
    return
  }

  const tasksByHandle = {};

  let nextHandle = 1; // Spec says greater than zero
  let currentlyRunningATask = false;
  let registerImmediate;

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
      const task = tasksByHandle[handle];
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
    registerImmediate = handle => {
      process.nextTick(() => { runIfPresent(handle); });
    };
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    const messagePrefix = `setImmediate$${Math.random()}$`;
    const onGlobalMessage = event => {
      if (event.source === global &&
                typeof event.data === 'string' &&
                event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    global.addEventListener('message', onGlobalMessage, false);

    registerImmediate = handle => {
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

const watchers = new WeakMap();
const dispatch = Symbol();
const isWatching = Symbol();
const timer = Symbol();
const isArray = Symbol();
const changes = Symbol();

const API = {
  watch (fn) {
    if (typeof fn !== 'function') throw `Sorry`

    if (!watchers.has(this)) watchers.set(this, []);
    watchers.get(this).push(fn);

    return this
  },

  unwatch (fn) {
    const callbacks = watchers.get(this);
    if (!callbacks) return

    if (fn) {
      const index = callbacks.indexOf(fn);
      if (~index) callbacks.splice(index, 1);
    } else watchers.set(this, []);

    return this
  },

  json () {
    return Object.keys(this).reduce((ret, key) => {
      const value = this[key];
      ret[key] = value && value.json ? value.json() : value;
      return ret
    }, this[isArray] ? [] : {})
  }
};

const TRAPS = {
  set (target, property, value) {
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

const define = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    value: value,
    enumerable: false,
    configurable: false,
    writable: false
  });
};

const enhance = obj => {
  Object.assign(obj, {
    [changes]: new Map(),
    [timer]: null,
    [isWatching]: true,
    [dispatch]: (property, value) => {
      if (watchers.has(obj)) {
        clearImmediate(obj[timer]);
        obj[changes].set(property, value);
        obj[timer] = setImmediate(() => {
          watchers.get(obj).forEach(fn => fn(obj[changes]));
          obj[changes].clear();
        });
      }
    }
  });

  Object.keys(API).forEach(key => {
    define(obj, key, API[key].bind(obj));
  });

  if (Array.isArray(obj)) {
    obj[isArray] = true;
    obj.forEach((item, i) => {
      obj[i] = null;
      TRAPS.set(obj, i, item);
    });
  }

  return obj
};

const observe = obj => {
  return new Proxy(
    enhance(obj || {}),
    Object.create(TRAPS)
  )
};

var is = {
  elementNode: node => node.nodeType === 1,
  textNode: node => node.nodeType === 3,
  obj: obj => obj != null && typeof obj === 'object',
  arr: arr => Array.isArray(arr)
};

class Compiler {
  constructor (vm) {
    this.vm = vm;
    const hooks = this.vm.__proto__;

    if (hooks.beforeMount) hooks.beforeMount();

    if (this.vm.components) this.components = this.vm.components();
    if (this.vm.template) this.template = this.html(this.vm.template());

    this.walkNodes(this.template);
    this.nodes(this.template);

    if (hooks.mounted) hooks.mounted();

    return this.template
  }

  html (html) {
    if (!html) return
  
    const el = document.createElement('html');
    el.innerHTML = html.trim();
  
    return el.children[1].firstChild
  }

  nodes (el) {
    const nodes = el.parentNode.querySelectorAll('*');

    for (let i = 0; i < nodes.length; i++) {
      this.checkAttrs(nodes[i].attributes);
    }
  }

  checkAttrs (nodes) {
    return Object.values(nodes).reduce((n, attr) => {
      const el = attr.ownerElement;
      const key = attr.nodeValue;
      const exp = attr.nodeName;

      if (/model/.test(exp)) return this.model(el, key, exp)
      if (/@/.test(exp)) return this.on(el, key, exp)
      if (/loop/.test(exp)) return this.loop(el, key, exp)
    }, [])
  }

  walkNodes (node) {
    if (!node) return

    const childs = node.childNodes;

    for (let i = 0; i < childs.length; i++) {
      const child = childs[i];
      const regx = /\{\{(.*)\}\}/;
      const text = child.textContent;

      if (regx.test(text)) {
        this.text(child, regx.exec(text)[1].trim());
      }

      if (is.elementNode(child)) {
        if (this.components && this.components.hasOwnProperty(child.localName)) {
          const Child = this.components[child.localName];
          new Child(child);
        }
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.walkNodes(child);
      }
    }
  }

  text (node, exp) {
    const text = this.vm.data[exp];
    node.textContent = text;

    this.vm.data.watch(changes => {
      node.textContent = changes.get(exp);
    });
  }

  on (el, key, exp) {
    const evt = exp.substr(1);

    el.addEventListener(evt, () => {
      if (this.vm[key]) this.vm[key](event);
    });
  }

  model (el, key, exp) {
    el.addEventListener('input', () => {
      this.vm.data[key] = el.value;
    });
  
    return el.value = this.vm.data[key]
  }

  loop (el, key, exp) {
    const name = key.split('in')[1].replace(/\s/g, '');
    const arr = this.vm.data[name];
    const p = el.parentNode;

    p.removeChild(el);

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const node = document.createElement(el.localName);

      node.textContent = item;
      p.appendChild(node);
    }
  }
}

const compiler = vm => new Compiler(vm);

class Lily {
  constructor (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body);
    this.data = observe(this.data());
    this.template = compiler(this);
    this.render();
    console.log(this);
  }

  render () {
    this.el.localName === 'body'
      ? this.el.appendChild(this.template)
      : this.el.parentNode.replaceChild(this.template, this.el);
  }

  static mount (app) {
    return new app()
  }
}

export default Lily;
