import Lily from './src/index.js'
// import HelloWorld from './helloworld.js'
// import Counter from './counter.js'
import List from './list.js'

class App extends Lily {
  components () {
    return {
      list: List
    }
  }

  data () {
    return {
      title: '🌷 Lily.js'
    }
  }

  template () {
    return /* html */`
      <div class="app">
        <h2>{{ title }}</h2>
        <input type="text" bind="title" />
        <list></list>
      </div>
    `
  }
}

Lily.mount(App)
