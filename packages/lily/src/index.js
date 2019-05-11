import { observe } from './observe.js'
import compile from './compile.js'

class Lily {
  constructor (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body)
    this.data = observe(this.data())
    this.template = compile(this)
    this.render()
  }

  render () {
    this.el.localName === 'body'
      ? this.el.appendChild(this.template)
      : this.el.parentNode.replaceChild(this.template, this.el)
  }

  static mount (app) {
    return new app()
  }
}

export default Lily
