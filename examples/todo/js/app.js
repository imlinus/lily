import Lily from './../../../packages/lily/index.js'
import store from './store/index.js'

import Todos from './components/todos.js'
import AddTodo from './components/add-todo.js'

class App extends Lily.Component {
  components () {
    return {
      Todos,
      AddTodo
    }
  }

  template () {
    const { title } = this.$state

    return /* html */`
      <section class="section">
        <h1 class="title">ToDo</h1>
        <todos></todos>
        <add-todo></add-todo>
      </section>
    `
  }
}

Lily.mount(App, { store })
