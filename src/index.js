import Compile from './compile.js'
import observe from './reactive/observer.js'
import html from './utils/html.js'

class Lily {
  constructor (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body)
    if (this.data) this.data = this.data()
    this.reactive()
    observe(this.data)
    this.template = new Compile(this).template
    this.render()
  }

  render () {
    // if (this.el.localName === 'body') {
      this.el.appendChild(this.template)
    // } else {
    //   const parent = this.el.parentNode
    //   parent.removeChild(this.el)
    //   parent.appendChild(this.template)
    // }
  }

  get (key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
  }

  reactive () {
    const keys = Object.keys(this.data)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: true,
        get () {
          return this.data[key]
        },
        set (val) {
          this.data[key] = val
        }
      })
    }
  }
}

Lily.prototype.config = {
  silent: false
}

export default Lily
