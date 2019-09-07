import observe from './observe.js'

class Lily {
  constructor (el, $props) {
    const { data, props, components, template } = this.__proto__

    this.$name = this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()
    this.$parent = (el && el instanceof HTMLElement ? el : el = document.body)

    if (data) this.$data = this.proxy(data())

    // Template
    if (!template) throw new Error('You need a template')
    this.$template = this.html(template(this.values, this.$data).flat(Infinity).join(''))

    this.nodes()
    this.render()

    console.log(this)
  }

  proxy (data) {
    const that = this

    return new Proxy(data, {
      get (obj, key) {
        return obj[key]
      },
      set (obj, key, val) {
        if (obj[key] !== val) {
          obj[key] = val
          console.log(obj[key])
        }
  
        return true
      }
    })
  }

  values (strings, ...values) {
    return strings.flatMap(str => {
      return [str].concat(values.shift())
    })
  }

  html (html) {
    if (!html) return
    const el = document.createElement('html')
    el.innerHTML = html.trim()
    return el.children[1].firstChild
  }

  render () {
    this.$parent.innerHTML = ''

    this.$parent.localName === 'body'
      ? this.$parent.appendChild(this.$template)
      : this.$parent.parentNode.replaceChild(this.$template, this.$parent)
  }

  nodes () {
    this.$template.parentNode.querySelectorAll('*')
      .forEach(node => this.checkAttrs(node.attributes))
  }

  checkAttrs (attrs) {
    return Object.values(attrs).reduce((n, attr) => {
      const data = { el: attr.ownerElement, key: attr.nodeValue, exp: attr.nodeName }
      const { el, key, exp } = data

      if (/model/.test(exp)) return this.model(el, key, exp)
      if (/@/.test(exp)) return this.on(el, key, exp)
    }, [])
  }

  model (el, key, exp) {
    el.addEventListener('input', () => {
      this.$data[key] = el.value
    })

    return el.value = this.$data[key]
  }

  on (el, key, exp) {
    const evt = exp.substr(1)

    el.addEventListener(evt, () => {
      if (this.__proto__[key]) this.__proto__[key](event)
    })
  }

  static mount (app) {
    return new app()
  }
}

export default Lily
