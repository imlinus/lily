import Lily from './../src/index.js'

class HelloWorld extends Lily {
  data () {
    return {
      title: 'Hello, World.'
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

const helloWorld = new HelloWorld()
