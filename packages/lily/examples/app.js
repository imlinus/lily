import Lily from './src/index.js'
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
    return `
      <div class="app">
        <h2>{{ title }}</h2>
        <input type="text" bind="title" />
        <list></list>
      </div>
    `
  }
}

Lily.mount(App)
