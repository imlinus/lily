export default {
  addTodo (state, todo) {
    state.todos = [...state.todos, todo]
  }
}
