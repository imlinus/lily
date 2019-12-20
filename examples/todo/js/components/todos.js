import Lily from './../../../../packages/lily/index.js'

class Todos extends Lily.Component {
  template () {
    const { todos } = this.$store.state

    return /* html */`
      <div class="list is-hoverable">
        <a
          loop="todo in todos"
          class="list-item">
          {{ todo }}
        </a>
      </div>
    `
  }
}

export default Todos
