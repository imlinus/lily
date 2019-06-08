import Lily from '//unpkg.com/lily'
import Columns from './columns.js'

class Intro extends Lily {
  components () {
    return {
      columns: Columns
    }
  }

  template () {
    return /* html */`
      <div class="container is-medium">
        <div class="container is-small">
          <p>
            Lorem ipsum dolor amet +1 ethical forage, everyday carry fixie kombucha austin retro hashtag hexagon.<br />
            Fixie dreamcatcher farm-to-table, hammock swag live-edge plaid banjo.<br />
            Gastropub thundercats jianbing poutine, bitters man braid godard whatever glossier.<br />
            Letterpress selfies taxidermy, sustainable godard helvetica gastropub 8-bit deep v.<br />
            Meditation coloring book neutra cronut. Disrupt fanny pack brooklyn sartorial mumblecore.
          </p>
        </div>

        <columns></columns>
      </div>
    `
  }
}

export default Intro
