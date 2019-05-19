import Lily from 'https://unpkg.com/lily@0.2.2/index.js'
import syntax from './../../../lil-syntax.js'

const code = document.createElement('code')
const template = syntax(`
import Lily from '//unpkg.com/lily'

class Navigation extends Lily {
  template () {
    return \`
      <ul class="navbar-items">
        <li class="navbar-item">
          <a href="#/">Home</a>
        </li>
        <li class="navbar-item">
          <a href="#/about">About</a>
        </li>
      </ul>
    \`
  }
}

export default Navigation
`.trim(''))

code.innerHTML = template

code.style.whiteSpace = 'pre-wrap'
code.style.display = 'block'

class Navigation extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>navigation.js</h3>
        ${code.outerHTML}
      </div>
    `
  }
}

export default Navigation
