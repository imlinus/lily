import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Navigation extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>navigation.js</h3>

        <code class="js" style="display: block; white-space: pre-wrap;">import Lily from '//unpkg.com/lily'

class Navigation extends Lily {
  template () {
    return &#96;
      &lt;ul class="navbar-items">
        &lt;li class="navbar-item">
          &lt;a href="#/">Home&lt;/a>
        &lt;/li>
        &lt;li class="navbar-item">
          &lt;a href="#/about">About&lt;/a>
        &lt;/li>
      &lt;/ul>
    &#96;
  }
}

export default Navigation</code>
      </div>
    `
  }
}

export default Navigation
