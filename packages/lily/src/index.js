import observe from './proxy/observe.js'
import compiler from './compile/compiler.js'
import is from './utils/is.js'

class Lily {
  constructor (el) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body)
    this.data = observe(this.data())
    this.template = compiler(this)
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
