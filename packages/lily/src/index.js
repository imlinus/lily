import Compile from './compile.js'
import observ from './reactive/observer.js'
import Watcher from './reactive/watcher.js'

class Lily {
  constructor (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body)
    if (this.data) this.data = observ(this.data())
    this.reactive() 
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

  set (data) {
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

  static mount (c) {
    return new c()
  }

  static use (p) {
    return new p()
  }
}

Lily.prototype.config = {
  silent: false
}

export default Lily
