import Watcher from './reactive/watcher.js'
import * as is from './utils/is.js'
import config from './config.js'

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
      const val = attr.nodeValue
      const el = attr.ownerElement

      if (new RegExp(config.symbols.model).test(method)) return this.model(el, val, method)
      if (new RegExp(config.symbols.event).test(method)) return this.on(el, val, method)
      if (new RegExp(config.symbols.loop).test(method)) return this.for(el, val, method)
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

      new Watcher(this.view, exp, newVal => {
        node.textContent = newVal ? newVal : ''
      })
    }
  }

  on (el, key, method) {
    const evt = method.substr(1)
    el.addEventListener(evt, () => this.view[key](event))
  }

  for (el, val, method) {
    console.log('loop', el, val, method)
  }

  model (el, key, method) {
    el.addEventListener('input', () => {
      this.view.data[key] = el.value
    })

    new Watcher(this.view, method, newVal => {
      el.value = newVal
    })

    return el.value = this.view.data[key]
  }
}

export default Compile
