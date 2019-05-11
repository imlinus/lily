import { watcher } from './observe.js'

class Compiler {
  constructor (vm) {
    const { data, components, template } = vm

    this.vm = vm
    const hooks = this.vm.__proto__

    if (hooks.beforeMount) hooks.beforeMount()
    if (data) this.data = data
    if (components) this.components = components()
    if (template) this.template = this.html(template())

    this.walkNodes(this.template)
    this.nodes(this.template)
    if (hooks.mounted) hooks.mounted()

    return this.template
  }

  html (html) {
    if (!html) return
    const el = document.createElement('html')
    el.innerHTML = html.trim()
    return el.children[1].firstChild
  }

  walkNodes (node) {
    if (!node) return

    node.childNodes.forEach(child => {
      const regx = /\{\{(.*)\}\}/
      const text = child.textContent

      if (regx.test(text)) {
        this.text(child, regx.exec(text)[1].trim())
      }

      if (child.nodeType === 1) {
        if (this.components && this.components.hasOwnProperty(child.localName)) {
          const Child = this.components[child.localName]
          new Child(child)
        }
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.walkNodes(child)
      }
    })
  }

  nodes (el) {
    el.parentNode.querySelectorAll('*')
      .forEach(node => this.checkAttrs(node.attributes))
  }

  checkAttrs (els) {
    return Object.values(els).reduce((n, attr) => {
      const data = { el: attr.ownerElement, key: attr.nodeValue, exp: attr.nodeName }
      const { el, key, exp } = data

      if (/model/.test(exp)) return this.model(el, key, exp)
      if (/@/.test(exp)) return this.on(el, key, exp)
      if (/loop/.test(exp)) return this.loop(el, key, exp)
    }, [])
  }

  text (node, exp) {
    const text = this.data[exp]
    if (text.constructor !== Object) node.textContent = text

    watcher(this.data, data => {
      node.textContent = data[exp]
    })
  }

  model (el, key, exp) {
    el.addEventListener('input', () => {
      this.data[key] = el.value
    })

    return el.value = this.data[key].constructor === Object
      ? ''
      : this.data[key]
  }

  on (el, key, exp) {
    const evt = exp.substr(1)

    el.addEventListener(evt, () => {
      if (this.vm[key]) this.vm[key](event)
    })
  }

  loop (el, key, exp) {
    const name = key.split('in')[1].replace(/\s/g, '')
    const arr = this.data[name]
    const p = el.parentNode

    p.removeChild(el)

    const replace = item => {
      const node = document.createElement(el.localName)
      node.textContent = item
      p.appendChild(node)
    }

    arr.forEach(item => replace(item))

    watcher(this.data, data => {
      data[name].forEach(item => replace(item))
    })
  }
}

const compile = vm => new Compiler(vm)

export default compile
