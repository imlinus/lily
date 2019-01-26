import Lily from './lily.js'
import Counter from './counter.js'
import List from './list.js'

class App extends Lily {
  data () {
    return {
      title: '🌷 Lily.js'
    }
  }

  components () {
    return {
      counter: Counter,
      list: List
    }
  }

  template () {
    return `
      <div class="app">
        <h2>{{ title }}</h2>
        <input type="text" model="title" />

        <counter></counter>
        <list></list>
      </div>
    `
  }
}

Lily.mount(App)
