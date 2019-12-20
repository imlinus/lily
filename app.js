import Lily from './lily/index.js'

class HelloWorld extends Lily.Component {
  template () {
    return /* html */`
      <div>
        <p>Hej, Världen</p>
      </div>
    `
  }
}

class App extends Lily.Component {
  state () {
    return {
      title: 'Hello, World.'
    }
  }

  components () {
    return {
      HelloWorld
    }
  }

  template () {
    const { title } = this.$state

    return /* html */`
      <div>
        <h1>{{ title }}</h1>
        <input model="title" />

        <hello-world></hello-world>
      </div>
    `
  }
}

Lily.mount(App)
