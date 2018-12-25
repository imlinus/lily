import Lily from './../src/index.js'

class App extends Lily {
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
      </div>
    `
  }
}

const app = new App()
