import Watcher from './reactive/watcher.js'
import * as is from './utils/is.js'
import html from './utils/html.js'

class Compile {
  constructor (vm) {
    this.vm = vm
    const hooks = this.vm.__proto__

    if (hooks.beforeMount) hooks.beforeMount()

    if (this.vm.components) {
      this.c = this.vm.components()
    }

    if (this.vm.template) {
      this.t = html(this.vm.template())
    }

    this.walkNodes(this.t)
    this.nodes(this.t)

    if (hooks.mounted) hooks.mounted()
  }

  nodes (el) {
    const nodes = el.parentNode.querySelectorAll('*')

    for (let i = 0; i < nodes.length; i++) {
      this.check(nodes[i].attributes)
    }
  }

  check (nodes) {
    return Object.values(nodes).reduce((n, attr) => {
      const fn = attr.nodeName
      const key = attr.nodeValue
      const el = attr.ownerElement

      if (/:style/.test(fn)) return this.style(el, key, fn)
      if (/bind/.test(fn)) return this.bind(el, key, fn)
      if (/@/.test(fn)) return this.on(el, key, fn)
      if (/loop/.test(fn)) return this.loop(el, key, fn)
    }, [])
  }

  walkNodes (node) {
    if (!node) return

    const childs = node.childNodes

    for (let i = 0; i < childs.length; i++) {
      const child = childs[i]
      const regx = /\{\{(.*)\}\}/
      const text = child.textContent

      if (is.elementNode(child)) {
        if (this.c && this.c.hasOwnProperty(child.localName)) {
          const C = this.c[child.localName]
          new C(child)
        }
      } else if (is.textNode(child) && regx.test(text)) {
        this.compileText(child, regx.exec(text)[1].trim())
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.walkNodes(child)
      }
    }
  }

  compileText (node, exp) {
    if (this.vm.data) {
      const text = this.vm.data[exp]
      node.textContent = text

      new Watcher(this.vm, exp, val => {
        node.textContent = val ? val : ''
      })
    }
  }

  on (el, key, fn) {
    const evt = fn.substr(1)

    el.addEventListener(evt, () => {
      if (this.vm[key]) this.vm[key](event)
    })
  }

  loop (el, key, fn) {
    const name = key.split('in')[1].replace(/\s/g, '')
    const arr = this.vm.data[name]
    const p = el.parentNode

    p.removeChild(el)

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const node = document.createElement(el.localName)

      node.textContent = item
      p.appendChild(node)
    }
  }

  bind (el, key, fn) {
    el.addEventListener('input', () => {
      this.vm.data[key] = el.value
    })

    new Watcher(this.vm, fn, val => {
      el.value = val
    })

    return el.value = this.vm.data[key]
  }

  style (el, key, fn) {
    const name = this.vm.data[key]
    el.classList.add(name)
  }
}

export default Compile
