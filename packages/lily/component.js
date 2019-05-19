import { observe } from './observe.js'
import  { watcher } from './observe.js'

class Component {
  constructor (vm, $props) {
    return this.init(vm.__proto__, $props)
  }

  init (vm, $props) {
    const { data, props, components, template, beforeMount } = vm
    this.vm = vm

    if (data) this.data = observe(data())

    if (props) {
      this.props = props()
      
      $props.forEach(obj => {
        const prop = this.props[obj.key]

        if (prop.type === obj.val.constructor) {
          this.props[obj.key].value = obj.val
        } else throw new Error('Prop not found')
      })
    }

    if (components) this.components = components()

    if (template) {
      this.template = this.html(template())
      this.walkNodes(this.template)
      this.nodes(this.template)
    } else throw new Error('Template needed')

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

      if (child.nodeType === 1 && this.components && this.components.hasOwnProperty(child.localName)) {
        const props = []
        
        Object.values(child.attributes).map(el => {
          props.push({ key: el.name, val: el.nodeValue })
        })

        new this.components[child.localName](child, props)
      }

      // if (child.childNodes && child.childNodes.length !== 0) {
      //   this.walkNodes(child)
      // }
    })
  }

  nodes (tpl) {
    tpl.parentNode.querySelectorAll('*')
      .forEach(node => this.checkAttrs(node.attributes))
  }

  checkAttrs (attrs) {
    return Object.values(attrs).reduce((n, attr) => {
      const data = { el: attr.ownerElement, key: attr.nodeValue, exp: attr.nodeName }
      const { el, key, exp } = data

      if (/model/.test(exp)) return this.model(el, key, exp)
      if (/@/.test(exp)) return this.on(el, key, exp)
      if (/loop/.test(exp)) return this.loop(el, key, exp)
    }, [])
  }

  text (node, key) {
    if (this.data) {
      node.textContent = this.data[key]

      watcher(this.data, data => {
        node.textContent = data[key]
      })
    } else if (this.props) {
      node.textContent = (this.props[key].value ? this.props[key].value : this.props[key].default)
    }
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

export default Component
