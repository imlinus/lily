import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Navigation extends Lily {
  template () {
    return /* html */`
      <ul class="navbar-items">
        <li class="navbar-item">
          <a href="#/">Home</a>
        </li>
        <li class="navbar-item">
          <a href="#/guide">Guide</a>
        </li>
        <li class="navbar-item">
          <a href="#/docs">Docs</a>
        </li>
      </ul>
    `
  }
}

export default Navigation
