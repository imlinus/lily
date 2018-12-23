import Lily from './../src/index.js'
import HelloWorld from './helloworld.js'

class App {
  constructor () {
    this.components = this.components()
    this.data = this.data()
    this.template = this.template()

    return this
  }

  components () {
    return {
      helloworld: new HelloWorld()
    }
  }

  data () {
    return {
      title: '🌷 Lily.js'
    }
  }

  template () {
    const { title, user } = this.data

    return /* html */`
      <div class="app">
        <h1>{{ title }}</h1>
        <helloworld />
      </div>
    `
  }
}

const app = new Lily(App)
