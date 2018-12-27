import Lily from 'lilyjs'
import HelloWorld from './helloworld.js'

class App extends Lily {
  data () {
    return {
      title: 'Hello, Lily'
    }
  }

  components () {
    return {
      helloworld: HelloWorld
    }
  }

  template () {
    return `
      <div class="app">
        <h1>{{ title }}</h1>
        <helloworld></helloworld>
      </div>
    `
  }
}

export default App
