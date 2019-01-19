import Lily from './../src/index.js'

class List extends Lily {
  data () {
    return {
      items: ['foo', 'bar', 'baz']
    }
  }

  template () {
    return `
      <ul class="list">
        <li loop="item in items">{{ item }}</li>
      </ul>
    `
  }
}

export default List
