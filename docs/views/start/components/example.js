import Lily from '//unpkg.com/lily'
import highlite from '//unpkg.com/highlite'

const code = document.createElement('code')
const template = highlite(`
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

code.style.whiteSpace = 'pre-wrap'
code.style.display = 'block'

class Example extends Lily {
  template () {
    
    return /* html */`
      <div class="col">
        ${code.outerHTML}
      </div>
    `
  }
}

export default Example
