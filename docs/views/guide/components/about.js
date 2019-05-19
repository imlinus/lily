import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class About extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>about.js</h3>

        <code class="js" style="display: block; white-space: pre-wrap;">import Lily from '//unpkg.com/lily'

class About extends Lily {
  template () {
    return &#96;
      &lt;section class="container">
        &lt;h3>About&lt;/h3>
        &lt;p>Lorem ipsum&lt;/p>
      &lt;section>
    &#96;
  }
}

export default About</code>
      </div>
    `
  }
}

export default About
