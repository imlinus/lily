import Watcher from './reactive/watcher.js'
import * as is from './utils/is.js'
import html from './utils/html.js'

class Compile {
  constructor (view) {
    this.view = view
    const hooks = this.view.__proto__

    if (hooks.beforeMount) hooks.beforeMount()

    if (this.view.components) {
      this.components = this.view.components()
    }

    if (this.view.template) {
      this.template = html(this.view.template())
    }

    this.walkNodes(this.template)
    this.nodes(this.template)

    if (hooks.mounted) hooks.mounted()

    // console.log(this)
  }

  nodes (el) {
    const nodes = el.parentNode.querySelectorAll('*')

    for (let i = 0; i < nodes.length; i++) {
      this.bindMethods(nodes[i].attributes)
    }
  }

  bindMethods (nodes) {
    return Object.values(nodes).reduce((n, attr) => {
      const method = attr.nodeName
      const key = attr.nodeValue
      const el = attr.ownerElement

      if (/:style/.test(method)) return this.style(el, key, method)
      if (/bind/.test(method)) return this.bind(el, key, method)
      if (/@/.test(method)) return this.on(el, key, method)
      if (/loop/.test(method)) return this.loop(el, key, method)
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
        if (this.components && this.components.hasOwnProperty(child.localName)) {
          const Component = this.components[child.localName]
          new Component(child)
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
    if (this.view.data) {
      const text = this.view.data[exp]
      node.textContent = text

      new Watcher(this.view, exp, val => {
        node.textContent = val ? val : ''
      })
    }
  }

  on (el, key, method) {
    const evt = method.substr(1)

    el.addEventListener(evt, () => {
      if (this.view[key]) this.view[key](event)
    })
  }

  loop (el, key, method) {
    const itemName = key.split('in')[0].replace(/\s/g, '')
    const arrName = key.split('in')[1].replace(/\s/g, '')
    const arr = this.view.data[arrName]
    const parent = el.parentNode

    parent.removeChild(el)

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const $el = document.createElement(el.localName)

      $el.textContent = item
      parent.appendChild($el)
    }
  }

  bind (el, key, method) {
    el.addEventListener('input', () => {
      this.view.data[key] = el.value
    })

    new Watcher(this.view, method, val => {
      el.value = val
    })

    return el.value = this.view.data[key]
  }

  style (el, key, method) {
    const className = this.view.data[key]
    el.classList.add(className)
  }
}

export default Compile
