import { observe, watcher } from './observe.js'

class Component {
  constructor (vm, $props) {
    const {
      data,
      props,
      components,
      template,
      beforeMount,
      mounted,
      destroyed
    } = vm.__proto__
    const $vm = this
    this.$vm = vm

    // Name
    this.name = vm.name

    // Template
    if (!template) throw new Error('You need a template :-D')
    this.template = this.html(template())

    if (data) this.data = observe(data())

    // Props
    if (props) {
      this.props = props()
      
      $props.forEach(obj => {
        const prop = this.props[obj.key]

        if (prop.type === obj.value.constructor) {
          this.props[obj.key].value = obj.value
        } else throw new Error('Prop not found')
      })
    }

    // Components
    if (components) {
      let data = components()
      let obj = {}

      Object.keys(data).forEach(key => {
        const kebab = key.split(/(?=[A-Z])/).join('-').toLowerCase()
        obj[kebab] = data[key]
      })

      this.components = obj
    }

    // LifeCycle Hooks
    if (beforeMount) this.beforeMount = beforeMount
    if (mounted) this.mounted = mounted
    if (destroyed) this.destroyed = destroyed

    this.initializeElement($vm)
  }

  initializeElement ($vm) {
    customElements.define(
      $vm.name,
      class extends HTMLElement {
        constructor () {
          super()
        }

        connectedCallback () {
          if ($vm.beforeMount) $vm.beforeMount()
          $vm.walkNodes($vm.template)
          $vm.nodes($vm.template)

          this.outerHTML = $vm.template.outerHTML
          if ($vm.mounted) $vm.mounted()
        }

        disconnectedCallback () {
          if ($vm.destroyed) $vm.destroyed()
        }
      }
    )
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
        this.text(child, regx.exec(text)[1].trim(), text)
      }

      if (
        child.nodeType === 1 &&
        this.components &&
        this.components.hasOwnProperty(child.localName)
      ) {
        const props = []
        
        Object.values(child.attributes).map(el => {
          props.push({ key: el.name, value: el.nodeValue })
        })

        new this.components[child.localName](props)
      }
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

      console.log(el, key, exp)

      if (/model/.test(exp)) return this.model(el, key, exp)
      if (/@/.test(exp)) return this.on(el, key, exp)
    }, [])
  }

  model (el, key, exp) {
    console.log('MODELK', el, key, exp)
    // el.addEventListener('input', () => {
    //   console.log(el.value)
    //   // this.data[key] = el.value
    // })

    // document.body.addEventListener('input', e => {
    //   if (el.isEqualNode(e.target)) {
    //     console.log(this.data[key], key)
    //     // this.data[key] = el.value
    //   }
    // })

    // return el.value = this.data[key].constructor === Object
    //   ? ''
    //   : this.data[key]
  }

  on (node, key, exp) {
    const evt = exp.substr(1)

    document.body.addEventListener(evt, e => {
      if (e.target.outerHTML === node.outerHTML) {
        if (this.$vm[key]) this.$vm[key](event)
      }
    })
  }

  text (node, key, text) {
    const regx = /\{\{(.*)\}\}/

    if (this.data) {
      node.textContent = this.data[key]

      watcher(this.data, data => {
        node.textContent = data[key]
      })
    } else if (this.props) {
      node.textContent = text.replace(regx, (this.props[key].value
        ? this.props[key].value
        : this.props[key].default
      ))
    }
  }
}

export default Component