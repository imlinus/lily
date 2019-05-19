import Lily from 'https://unpkg.com/lily@0.2.2/index.js'
import LilyRouter from '//unpkg.com/lily-router'

import Navbar from './components/navbar.js'
import routes from './routes.js'

class App extends Lily {
  components () {
    return {
      navbar: Navbar
    }
  }

  template () {
    return /* html */`
      <div class="app">
        <navbar></navbar>
        <div class="wrapper" router></div>
      </div>
    `
  }

  mounted () {
    new LilyRouter(routes)
  }
}

Lily.mount(App)
