import Lily from '//unpkg.com/lily'
import LilyRouter from '//unpkg.com/lily-router'

import Topbar from './components/topbar.js'
import Footer from './components/footer.js'
import routes from './routes.js'

class App extends Lily {
  components () {
    return {
      topbar: Topbar,
      footer: Footer
    }
  }

  template () {
    return /* html */`
      <div class="app">
        <topbar></topbar>
        <div class="wrapper" router></div>
        <footer></footer>
      </div>
    `
  }

  mounted () {
    new LilyRouter(routes)
    document.documentElement.setAttribute('theme', 'dark')
  }
}

Lily.mount(App)
