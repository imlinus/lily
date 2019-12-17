class Component {
  constructor () {
    this.$state = this.initializeProxy()

    if (this.state) {
      this.setState(this.state())
    }

    if (this.template) {
      this.$template = this.toHTML(this.template(this.html))
    }

    this.nodes()
    this.render()
  }

  initializeProxy () {
    return new Proxy({}, {
      get (state, key) {
        return state[key]
      },

      set (state, key, value) {
        if (state[key] !== value) {
          state[key] = value
        }

        return true
      }
    })
  }

  setState (state) {
    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        this.$state[key] = state[key]
      }
    }
  }

  html ([first, ...strings], ...values) {
    // https://github.com/stasm/innerself/
    return values.reduce((acc, cur) =>
      acc.concat(cur, strings.shift()), [first])
        .filter(x => x && x !== true || x === 0)
        .join('')
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

      if (/@/.test(expression)) return this.on(node, key, expression)
    }, [])
  }

  on (node, key, expression) {
    const evt = expression.substr(1)

    node.addEventListener(evt, () => {
      if (this.__proto__[key]) this.__proto__[key](event)
    })
  }

  render () {
    // I'm lazy :-D
    document.body.appendChild(this.$template)
  }
}

export default Component
