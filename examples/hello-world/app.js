import Lily from './../../packages/lily/index.js'

class App extends Lily.Component {
  state () {
    return {
      title: 'Hello, World.'
    }
  }

  template () {
    const { title } = this.$state

    return /* html */`
      <div>
        <h1>{{ title }}</h1>
        <input model="title" />
      </div>
    `
  }
}

Lily.mount(App)
