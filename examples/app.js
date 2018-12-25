import Lily from './../src/index.js'
import HelloWorld from './helloworld.js'
import Counter from './counter.js'
import List from './list.js'

class App extends Lily {
  components () {
    return {
      'hello-world': HelloWorld, // testing string key
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
        <hello-world></hello-world>
        <h2>{{ title }}</h2>
        <input type="text" bind="title" />

        <counter></counter>
        <list></list>
      </div>
    `
  }
}

const app = new App()
