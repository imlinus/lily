import Lily from 'https://unpkg.com/lily@0.2.2/index.js'
import syntax from './../../../lil-syntax.js'

const code = document.createElement('code')
const template = syntax(`
import Lily from '//unpkg.com/lily'
import Router from '//unpkg.com/lily-router'

import Start from './start.js'
import About from './about.js'

const routes = {
  '/': Start,
  '/about': About,
}

class App extends Lily {
  components () {
    return {
      navigation: Navigation
    }
  }

  template () {
    return \`
      <div class="app">
        <navigation></navigation>
        <div class="wrapper" router></div>
      </div>
    \`
  }

  mounted () {
    new Router(routes)
  }
}

Lily.mount(App)
`.trim(''))

code.innerHTML = template

code.style.whiteSpace = 'pre-wrap'
code.style.display = 'block'

class App extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>app.js</h3>
        ${code.outerHTML}
      </div>
    `
  }
}

export default App
