import PubSub from './pubsub.js'
import observe from './observe.js'

class Component {
  constructor (el) {
    const self = this

    this.$name = this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()
    this.$el = (el && el instanceof HTMLElement ? el : el = document.body)
    this.$events = new PubSub()
    this.$state = observe(null, this.$events)

    if (this.state) {
      this.setState(this.state())
    }

    this.initializeComponents()
    this.mount()
    this.replaceComponents(this.$template)
  }

  initializeComponents () {
    if (this.components) {
      let data = this.components()
      let $components = {}

      Object.keys(data).forEach(key => {
        const kebab = key.split(/(?=[A-Z])/).join('-').toLowerCase()
        $components[kebab] = data[key]
      })

      this.$components = $components
    }
  }

  replaceComponents (node) {
    if (!node) return
  
    node.childNodes.forEach(child => {
      if (
        child.nodeType === 1 &&
        this.$components &&
        this.$components.hasOwnProperty(child.localName)
      ) {
        new this.$components[child.localName](child)
      }
    })
  }

  mount () {
    this.$template = this.toHTML(this.template())
    this.walkNodes(this.$template)
    this.nodes()
    this.render()
  }

  setState (state) {
    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        this.$state[key] = state[key]
      }
    }
  }

  toHTML (html) {
    if (!html) return
    const el = document.createElement('html')
    el.innerHTML = html.trim()
    return el.children[1].firstChild
  }

  nodes () {
    this.$template.parentNode.querySelectorAll('*')
      .forEach(node => this.checkAttrs(node.attributes))
  }

  checkAttrs (attrs) {
    return Object.values(attrs).reduce((n, attr) => {
      const data = { node: attr.ownerElement, key: attr.nodeValue, expression: attr.nodeName }
      const { node, key, expression } = data

      if (/model/.test(expression)) return this.model(node, key, expression)
      if (/@/.test(expression)) return this.on(node, key, expression)
    }, [])
  }

  walkNodes (node) {
    if (!node) return

    node.childNodes.forEach(child => {
      const regx = /\{\{(.*)\}\}/
      const text = child.textContent

      if (regx.test(text)) {
        this.text(child, regx.exec(text)[1].trim())
      }

      if (child.childNodes && child.childNodes.length !== 0) {
        this.walkNodes(child)
      }
    })
  }

  model (node, key, expression) {
    node.addEventListener('input', () => {
      this.$state[key] = node.value
    })
  
    return node.value = this.$state[key]
  }

  on (node, key, expression) {
    const evt = expression.substr(1)

    node.addEventListener(evt, () => {
      if (this[key]) this[key](event)
    })
  }

  text (node, expression) {
    const text = this.$state[expression]
    node.textContent = text

    this.$events.on('stateChange', value => {
      node.textContent = value
    })
  }

  render () {
    this.$el.localName === 'body'
      ? this.$el.appendChild(this.$template)
      : this.$el.parentNode.replaceChild(this.$template, this.$el)
  }
}

export default Component
