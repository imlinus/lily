import Component from './component.js'

class Lily {
  constructor (el, props) {
    this.init(el, props)
  }

  async init (el, props) {
    this.el = (el && el instanceof HTMLElement ? el : el = document.body)
    this.template = await new Component(this, props)
    this.render()
    if (this.__proto__.mounted) this.__proto__.mounted()
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
