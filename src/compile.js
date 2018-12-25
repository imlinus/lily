import Watcher from './reactive/watcher.js'
import * as is from './utils/is.js'

class Compile {
  constructor (view) {
    this.view = view
    const hooks = this.view.__proto__

    if (hooks.beforeMount) hooks.beforeMount()

    if (this.view.components) {
      this.components = this.view.components()
    }

    if (this.view.template) {
      this.template = this.html(this.view.template())
    }

    this.walkNodes(this.template)
    this.nodes(this.template)

    if (hooks.mounted) hooks.mounted()
  }

  html (html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()

    return template.content.firstChild
  }

  nodes (el) {
    const nodes = el.querySelectorAll('*')

    for (let i = 0; i < nodes.length; i++) {
      this.bindMethods(nodes[i].attributes)
    }
  }

  bindMethods (nodes) {
    return Object.values(nodes).reduce((n, attr) => {
      const method = attr.nodeName
      const key = attr.nodeValue
      const el = attr.ownerElement

      // https://koukia.ca/top-6-ways-to-search-for-a-string-in-javascript-and-performance-benchmarks-ce3e9b81ad31
      if (/bind/.test(method)) return this.bind(el, key, method)
      if (/@/.test(method)) return this.on(el, key, method)
      if (/loop/.test(method)) return this.loop(el, key, method)
    }, [])
  }

  walkNodes (node) {
    const childs = node.childNodes

    for (let i = 0; i < childs.length; i++) {
      const child = childs[i]
      const regx = /\{\{(.*)\}\}/
      const text = child.textContent

      if (is.elementNode(child)) {
        // do nothing for now
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
    el.addEventListener(evt, () => this.view[key](event))
  }

  loop (el, key, method) {
    const itemName = key.split('in')[0].replace(/\s/g, '')
    const arrName = key.split('in')[1].replace(/\s/g, '')
    const arr = this.view.data[arrName]
    const parent = el.parentNode
    const elType = el.localName

    parent.removeChild(el)

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const newEl = document.createElement(elType)

      newEl.textContent = item
      parent.appendChild(newEl)
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
}

export default Compile
