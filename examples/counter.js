import Lily from './../src/index.js'

class Counter extends Lily {
  data () {
    return {
      i: 0
    }
  }

  template () {
    return /* html */`
      <div class="counter">
        <p>{{ i }}</p>
        <button @click="increment">+1!</button>
      </div>
    `
  }

  increment () {
    this.set('i', this.data.i + 1)
  }
}

const counter = new Counter()
