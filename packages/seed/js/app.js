import Lily from '//unpkg.com/lily'
import HelloWorld from './components/helloworld.js'

class MainView extends Lily {
  name () {
    return 'main-view'
  }

  components () {
    return {
      'hello-world': HelloWorld
    }
  }

  template () {
    return /* html */`
      <div class="app">
        <hello-world name="Lily."></hello-world>
        <button @click="hello">Hello</button>
      </div>
    `
  }

  hello () {
    console.log('Hello')
  }
}

Lily.mount(MainView)
