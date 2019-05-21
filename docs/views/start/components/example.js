import Lily from '//unpkg.com/lily'
import syntax from './../../../lil-syntax.js'

const code = document.createElement('code')
const template = syntax(`
import Lily from '//unpkg.com/lily'

class App extends Lily {
  data () {
    return {
      title: 'Hello, Lily'
    }
  }

  template () {
    return \`
      <div>
        <h2>{{ title }}</h2>
        <input type="text" model="title" />
      </div>
    \`
  }
}

Lily.mount(App)
`.trim(''))

code.innerHTML = template
code.style.display = 'block'

class Example extends Lily {
  template () {
    return /* html */`
      <div class="column">
        ${code.outerHTML}
      </div>
    `
  }
}

export default Example
