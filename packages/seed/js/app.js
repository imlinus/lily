import Lily from '//unpkg.com/lily'
import HelloWorld from './components/helloworld.js'

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
    return /* html */`
      <div class="app">
        <h1>{{ title }}</h1>
        <helloworld></helloworld>
      </div>
    `
  }
}

Lily.mount(App)
