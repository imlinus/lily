import Watcher from './watcher.js'

class Compile {
  constructor (view, el) {
    this.view = view
    this.el = el
  
    this.init()
  }

  init () {
    this.run = this.view.__proto__
    if (this.run.beforeMount) this.run.beforeMount()

    this.template = this.html(this.view.template)
    this.compileElement(this.template)

    if (this.el) {
      console.log('el', this.el)
      this.el.appendChild(this.template)
    }

    if (this.run.mounted) this.run.mounted()
  }

  html (html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()

    return template.content.firstChild
  }

  compileElement (node) {
    const childs = node.childNodes

    for (let i = 0; i < childs.length; i++) {
      const child = childs[i]
      const regx = /\{\{(.*)\}\}/
      const text = child.textContent

      if (this.isElementNode(child)) {
        this.compile(child)
      } else if (this.isTextNode(child) && regx.test(text)) {
        this.compileText(child, regx.exec(text)[1].trim())
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.compileElement(child)
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

  compile (node) {
    if (this.view.components) {
      const component = this.view.components[node.localName]

      if (component) {
        const comp = new Compile(component, this.template)
        this.checkAttrs(node)
      }
    } else {
      this.checkAttrs(node)
    }
  }

  checkAttrs (node) {
    const attrs = node.attributes

    // check attributes
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i]

      if (this.isModelDirective(attr.name)) {
        let tagName = node.tagName.toLowerCase()
        console.log('isModelDirective', tagName, node)
      } else if (this.isLoopDirective(attr.name)) {
        console.log('isLoopDirective', node)
      } else if (this.isEventDirective(attr.name)) {
        console.log('isEventDirective', node)
      } else if (this.isBindDirective(attr.name)) {
        const key = attr.name.substr(1)
        const val = attr.nodeValue
        console.log('isBindDirective', key, val, node)
      }
    }
  }

  isElementNode (node) {
    return node.nodeType === 1
  }

  isTextNode (node) {
    return node.nodeType === 3
  }

  isModelDirective (val) {
    return val === 'model'
  }

  isLoopDirective (val) {
    return val === 'loop'
  }

  isEventDirective (val) {
    return val.indexOf('@') !== -1
  }

  isBindDirective (val) {
    return val.startsWith(':')
  }
}

export default Compile
