import Component from './component.js'

class Lily {
  constructor (props) {
    return new Component(this, props)
  }

  static mount (app) {
    return new app()
  }
}

export default Lily
