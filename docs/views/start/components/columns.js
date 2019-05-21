import Lily from '//unpkg.com/lily'

import Example from './example.js'
import Hello from './hello.js'

class Columns extends Lily {
  components () {
    return {
      example: Example,
      hello: Hello
    }
  }

  template () {
    return /* html */`
      <div class="columns">
        <example></example>
        <hello></hello>
      </div>
    `
  }
}

export default Columns
