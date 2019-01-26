import Lily from './lily.js'

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

  mounted () {
    setTimeout(() => {
      this.data().items.push('linus')
      // this.data.items.push('linus')
    }, 1000)
  }
}

export default List
