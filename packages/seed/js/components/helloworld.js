import Lily from '//unpkg.com/lily'

class HelloWorld extends Lily {
  name () {
    return 'hello-world'
  }

  props () {
    return {
      name: {
        type: String,
        default: 'world.'
      }
    }
  }

  template () {
    return /* html */`
      <h3>Hello, {{ name }}</h3>
    `
  }
}

export default HelloWorld
