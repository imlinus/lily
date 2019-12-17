import { mount, Component } from './../lily/index.js'

class App extends Component {
  state () {
    return {
      title: 'Hello, World.'
    }
  }

  hello () {
    console.log('Hello')
  }

  template (html) {
    const { title } = this.$state

    return html`
      <div>
        <h1>${title}</h1>
        <button @click="hello">Hello</button>
      </div>
    `
  }
}

mount(App)
