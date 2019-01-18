import Lily from './../src/index.js'

class List extends Lily {
  data () {
    return {
      items: ['foo', 'bar', 'baz'],
    }
  }

  template () {
    return `
      <ul class="list">
        <li loop="item in items">{{ item }}</li>
      </ul>
    `
  }

  mounted () {
    console.log('List mounted')
    this.addItems()
  }

  addItems () {
    this.set({ items: ['linus'] })
  }
}

export default List
