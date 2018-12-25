import Lily from './../src/index.js'
import Counter from './counter.js'
import List from './list.js'

class App extends Lily {
  components () {
    return {
      counter: Counter,
      list: List
    }
  }

  data () {
    return {
      title: '🌷 Lily.js',
    }
  }

  template () {
    return /* html */`
      <div class="app">
        <h2>{{ title }}</h2>
        <input type="text" bind="title" />

        <counter />
        <list />
      </div>
    `
  }
}

const app = new App()
