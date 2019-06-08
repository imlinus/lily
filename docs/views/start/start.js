import Lily from '//unpkg.com/lily'

import Hero from './components/hero.js'
import Intro from './components/intro.js'

class Start extends Lily {
  components () {
    return {
      hero: Hero,
      intro: Intro
    }
  }

  template () {
    return /* html */`
      <div class="page-start">
        <hero></hero>
        <intro></intro>
      </div>
    `
  }
}

export default Start
