import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class App extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>app.js</h3>

        <code class="js" style="display: block; white-space: pre-wrap;">import Lily from '//unpkg.com/lily'
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
    return &#96;
      &lt;div class="app"&gt;
        &lt;navigation>&lt;/navigation>
        &lt;div class="wrapper" router&gt;&lt;/div&gt;
      &lt;/div&gt;
    &#96;
  }

  mounted () {
    new Router(routes)
  }
}

Lily.mount(App)</code>
      </div>
    `
  }
}

export default App
