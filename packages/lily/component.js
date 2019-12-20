import PubSub from './pubsub.js'

class Component {
  constructor (node, store) {
    const self = this

    this.$name = this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()
    this.$parent = (node && node instanceof HTMLElement ? node : node = document.body)
    this.$events = new PubSub()
    this.$state = this.observe()

    if (this.state) {
      this.setState(this.state())
    }

    if (store) {
      this.$store = store

      this.$store.events.on('stateChange', () => {
        console.log('store statechange')
      })
    }

    console.log(this)

    this.mount()
    this.render()
  }

  observe () {
    const self = this

    return new Proxy({}, {
      get (state, key) {
        return state[key]
      },
  
      set (state, key, value) {
        if (state[key] !== value) {
          state[key] = value
          self.$events.emit('stateChange', value)
        }
  
        return true
      }
    })
  }

  mountComponents () {
    if (this.components) {
      let data = this.components()
      let $components = {}

      Object.keys(data).forEach(key => {
        const kebab = key.split(/(?=[A-Z])/).join('-').toLowerCase()
        $components[kebab] = data[key]
      })

      this.$components = $components

      this.$template.childNodes.forEach(child => {
        if (
          child.nodeType === 1 &&
          this.$components &&
          this.$components.hasOwnProperty(child.localName)
        ) {
          new this.$components[child.localName](child, (this.$store || null))
        }
      })
    }
  }

  mount () {
    this.$template = this.toHTML(this.template())
    this.walkNodes(this.$template)
    this.nodes()
    this.mountComponents()
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
    const node = document.createElement('html')
    node.innerHTML = html.trim()
    return node.children[1].firstChild
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
      if (/loop/.test(expression)) return this.loop(node, key, expression)
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

  loop (node, key, expression) {
    const name = key.split('in')[1].replace(/\s/g, '')
    const array = this.$state[name] || this.$store.state[name]
    const parent = node.parentNode
    
    parent.innerHTML = ''

    const replace = item => {
      const el = document.createElement(node.localName)
      el.className = node.className
      el.textContent = item
      parent.appendChild(el)
    }

    array.forEach(item => replace(item))
    
    if (this.$store) {
      this.$store.events.on('stateChange', value => {
        parent.innerHTML = ''
        value[name].forEach(item => replace(item))
      })
    }
  }

  render () {
    this.$parent.localName === 'body'
      ? this.$parent.appendChild(this.$template)
      : this.$parent.parentNode.replaceChild(this.$template, this.$parent)
  }
}

export default Component
