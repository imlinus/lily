import { mount, Component } from './lily/index.js'

class App extends Component {
  state () {
    return {
      title: 'Hello, World.'
    }
  }

  hello () {
    this.$state.title = 'Hello, Lily'
  }

  template () {
    const { title } = this.$state

    return /* html */`
      <div>
        <h1>{{ title }}</h1>
        <button @click="hello">Hello</button>
        <input model="title" />
      </div>
    `
  }
}

mount(App)
