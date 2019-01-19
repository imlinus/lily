import Lily from './../src/index.js'

class HelloWorld extends Lily {
  props () {
    return {
      title: {
        type: String,
        default: 'Hello, world'
      }
    }
  }

  template () {
    return /* html */`
      <div class="hello-world">
        <h2>{{ title }}</h2>
      </div>
    `
  }
}

export default HelloWorld
