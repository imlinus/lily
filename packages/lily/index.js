import Component from './component.js'

const mount = (app, options) => {
  if (options) {
    const { node, store } = options
    return new app(node, store)
  } else {
    return new app()
  }
}

export default {
  Component,
  mount
}
