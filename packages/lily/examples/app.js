<<<<<<< HEAD
import Lily from './lily.js'
import Counter from './counter.js'
=======
import Lily from './src/index.js'
import List from './list.js'
>>>>>>> d80b7c8dbd1df16056b8497074c8e1ada089f68a

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
    return `
      <div class="app">
        <h2>{{ title }}</h2>
        <input type="text" model="title" />
        <counter></counter>
      </div>
    `
  }
}

Lily.mount(App)
