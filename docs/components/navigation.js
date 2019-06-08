import Lily from '//unpkg.com/lily'

class Navigation extends Lily {
  template () {
    return /* html */`
      <ul>
        <li class="nav-item">
          <a href="#/">Home</a>
        </li>
        <li class="nav-item">
          <a href="#/guide">Guide</a>
        </li>
        <li class="nav-item">
          <a href="#/docs">Docs</a>
        </li>
      </ul>
    `
  }
}

export default Navigation
