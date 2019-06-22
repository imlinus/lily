import Component from './component.js'

class Lily {
  constructor (el) {
    return new Component(this)
  }

  static mount (app) {
    return new app()
  }
}

export default Lily
