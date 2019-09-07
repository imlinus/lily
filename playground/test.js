import Lily from './index.js'

class MainView extends Lily {
  data () {
    return {
      title: 'Världen'
    }
  }

  template (html, data) {
    const { title } = data

    return html`
      <div class="app">
        <h1>Hej, ${title}</h1>
      </div>
    `
  }
}

Lily.mount(MainView)
