import Lily from '//unpkg.com/lily'
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
      <section class="container is-small">
        <h3>Guide</h3>
        <p>Lorem ipsum dolor amet +1 ethical forage, everyday carry fixie kombucha austin retro hashtag hexagon. Fixie dreamcatcher farm-to-table, hammock swag live-edge plaid banjo. Gastropub thundercats jianbing poutine, bitters man braid godard whatever glossier. Letterpress selfies taxidermy, sustainable godard helvetica gastropub 8-bit deep v. Meditation coloring book neutra cronut. Disrupt fanny pack brooklyn sartorial mumblecore. Forage austin air plant single-origin coffee franzen you probably haven't heard of them lumbersexual.</p>

        <markup></markup>
        <hr />
        <app></app>
        <hr />
        <navigation></navigation>
        <hr />
        <start></start>
        <hr />
        <about></about>
      </section>
    `
  }
}

export default Guide
