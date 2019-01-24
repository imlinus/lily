import Lily from './../src/index.js'

class Counter extends Lily {
  data () {
    return {
      counter: 0
    }
  }

  template () {
    return /* html */`
      <div class="counter">
        <p>{{ counter }}</p>
        <button @click="increment">+1!</button>
      </div>
    `
  }

  increment () {
    this.data.counter++
  }
}

export default Counter
