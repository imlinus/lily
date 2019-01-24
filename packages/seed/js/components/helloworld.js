import Lily from 'lily'

class HelloWorld extends Lily {
  data () {
    return {
      title: 'Hello, World.'
    }
  }

  template () {
    return `
      <div class="hello-world">
        <h3>{{ title }}</h3>
      </div>
    `
  }
}

export default HelloWorld
