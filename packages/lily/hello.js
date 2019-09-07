import Lily from './index.js'

class HelloWorld extends Lily {
  data () {
    return {
      title: 'Hello'
    }
  }

  template () {
    return /* html */`
      <div>
        <h1>{{ title }}</h1>
        <input model="title" type="text" />
      </div>
    `
  }
}

export default HelloWorld
