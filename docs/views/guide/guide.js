import Lily from 'https://unpkg.com/lily@0.2.2/index.js'
import Markup from './components/markup.js'
import App from './components/app.js'
import Navigation from './components/navigation.js'
import Start from './components/start.js'
import About from './components/about.js'

class Guide extends Lily {
  components () {
    return {
      markup: Markup,
      app: App,
      navigation: Navigation,
      start: Start,
      about: About
    }
  }

  template () {
    return /* html */`
      <section class="container">
        <h3>Guide</h3>
        <p>This guide will introduce you to the basics of Lily.</p>

        <markup></markup>
        <app></app>
        <navigation></navigation>
        <start></start>
        <about></about>
      </section>
    `
  }
}

export default Guide
