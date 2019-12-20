import Lily from './../../../../packages/lily/index.js'

class AddTodo extends Lily.Component {
  state () {
    return {
      todo: ''
    }
  }

  add () {
    this.$store.dispatch('addTodo', this.$state.todo)
  }

  template () {
    return /* html */`
      <div class="field is-grouped">
        <p class="control is-expanded">
          <input
            model="todo"
            class="input"
            type="text"
            placeholder="What's on your schedule?"
          />
        </p>

        <p class="control">
          <button class="button is-info" @click="add">Add</button>
        </p>
      </div>
    `
  }
}

export default AddTodo
