import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Start extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>start.js</h3>

        <code class="js" style="display: block; white-space: pre-wrap;">import Lily from '//unpkg.com/lily'

class Start extends Lily {
  template () {
    return &#96;
      &lt;section class="container">
        &lt;h3>Start&lt;/h3>
        &lt;p>Lorem ipsum&lt;/p>
      &lt;section>
    &#96;
  }
}

export default Start</code>
      </div>
    `
  }
}

export default Start
