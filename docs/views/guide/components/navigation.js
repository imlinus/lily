import Lily from '//unpkg.com/lily'
import highlite from '//unpkg.com/highlite'

const code = document.createElement('code')
const template = highlite(`
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
