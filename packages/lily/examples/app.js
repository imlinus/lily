import Lily from './lily.js'
import Counter from './counter.js'

class App extends Lily {
  data () {
    return {
      title: '🌷 Lily.js'
    }
  }

  components () {
    return {
      counter: Counter
    }
  }

  template () {
    return /* html */`
      <div class="app">
        <h2>{{ title }}</h2>
        <input type="text" model="title" />

        <counter></counter>
      </div>
    `
  }
}

Lily.mount(App)
