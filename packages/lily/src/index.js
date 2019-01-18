import Compile from './compile.js'
import observe from './reactive/observer.js'
import html from './utils/html.js'

class Lily {
  constructor (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body)
    if (this.data) this.data = this.data()
    this.reactive() 
    observe(this.data)
    this.template = new Compile(this).t
    this.render()
    console.log(this)
  }

  render () {
    this.el.localName === 'body'
      ? this.el.appendChild(this.template)
      : this.el.parentNode.replaceChild(this.template, this.el)
  }

  get (key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
    // const key = Object.keys(data)[0]
    // const val = data[key]

    // if (val.constructor === Array) {
    //   this.data()[key].concat(val)
    //   console.log(this.data()[key], val, this.data()[key].concat(val))
    // } else if (val.constructor === Object) {
    //   Object.assign(this.data[key], val)
    // } else {
    //   this.data[key] = data[key]
    // }
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

  static mount (c) {
    return new c()
  }
}

Lily.prototype.config = {
  silent: false
}

export default Lily
