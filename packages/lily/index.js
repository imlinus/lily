import Component from './component.js'

class Lily {
  constructor (props) {
    this.name = this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()
    return new Component(this, props)
  }

  static mount (app) {
    return new app()
  }
}

export default Lily
