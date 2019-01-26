import is from './../utils/is.js'

class Compiler {
  constructor (vm) {
    this.vm = vm
    const hooks = this.vm.__proto__

    if (hooks.beforeMount) hooks.beforeMount()

    if (this.vm.components) this.components = this.vm.components()
    if (this.vm.template) this.template = this.html(this.vm.template())

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

  nodes (el) {
    const nodes = el.parentNode.querySelectorAll('*')

    for (let i = 0; i < nodes.length; i++) {
      this.checkAttrs(nodes[i].attributes)
    }
  }

  checkAttrs (nodes) {
    return Object.values(nodes).reduce((n, attr) => {
      const el = attr.ownerElement
      const key = attr.nodeValue
      const exp = attr.nodeName

      if (/model/.test(exp)) return this.model(el, key, exp)
      if (/@/.test(exp)) return this.on(el, key, exp)
      if (/loop/.test(exp)) return this.loop(el, key, exp)
    }, [])
  }

  walkNodes (node) {
    if (!node) return

    const childs = node.childNodes

    for (let i = 0; i < childs.length; i++) {
      const child = childs[i]
      const regx = /\{\{(.*)\}\}/
      const text = child.textContent

      if (regx.test(text)) {
        this.text(child, regx.exec(text)[1].trim())
      }

      if (is.elementNode(child)) {
        if (this.components && this.components.hasOwnProperty(child.localName)) {
          const Child = this.components[child.localName]
          new Child(child)
        }
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.walkNodes(child)
      }
    }
  }

  text (node, exp) {
    const text = this.vm.data[exp]
    node.textContent = text

    this.vm.data.watch = data => {
      node.textContent = data[exp]
    }
  }

  on (el, key, exp) {
    const evt = exp.substr(1)

    el.addEventListener(evt, () => {
      if (this.vm[key]) this.vm[key](event)
    })
  }

  model (el, key, exp) {
    el.addEventListener('input', () => {
      this.vm.data[key] = el.value
    })
  
    return el.value = this.vm.data[key]
  }

  loop (el, key, exp) {
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

    this.vm.data.watch = data => {
      console.log(data[name])
      // node.textContent = data[exp]
    }
  }
}

const compiler = vm => new Compiler(vm)

export default compiler
