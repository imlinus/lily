import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Model extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>Model</h3>
        <p>You can use the <span>model</span> directive to create two-way data bindings on form inputs.</p>

        <code class="js" style="display: block; white-space: pre-wrap;">import Lily from '//unpkg.com/lily'

class Model extends Lily {
  data () {
    return {
      title: 'Model'
    }
  }

  template () {
    return &#96;
      &lt;div&gt;
        &lt;h3&gt;{{ title }}&lt;/h3&gt;
        &lt;input type="text" model="title" /&gt;
      &lt;/div&gt;
    &#96;
  }
}

export default Model</code>
      </div>
    `
  }
}

export default Model
