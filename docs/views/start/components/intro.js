import Lily from '//unpkg.com/lily'
import syntax from './../../../lil-syntax.js'

import Columns from './columns.js'

class Intro extends Lily {
  components () {
    return {
      columns: Columns
    }
  }

  template () {
    return /* html */`
      <div class="container">
        <div class="container is-small">
          <p>Lorem ipsum dolor amet +1 ethical forage, everyday carry fixie kombucha austin retro hashtag hexagon. Fixie dreamcatcher farm-to-table, hammock swag live-edge plaid banjo. Gastropub thundercats jianbing poutine, bitters man braid godard whatever glossier. Letterpress selfies taxidermy, sustainable godard helvetica gastropub 8-bit deep v. Meditation coloring book neutra cronut. Disrupt fanny pack brooklyn sartorial mumblecore.</p>
        </div>

        <columns></columns>
      </div>
    `
  }
}

export default Intro
