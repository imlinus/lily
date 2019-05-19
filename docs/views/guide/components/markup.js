import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Markup extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>index.html</h3>

        <code class="html" style="display: block; white-space: pre-wrap;">&lt;!DOCTYPE html>
&lt;html>
&lt;head>
  &lt;meta charset="utf-8" />
  &lt;meta http-equiv="X-UA-Compatible" content="IE=edge" />
  &lt;meta name="viewport" content="width=device-width, initial-scale=1" />
  &lt;title>Lily.js&lt;/title>
&lt;/head>
&lt;body>
  &lt;script type="module" src="./app.js"></script>
&lt;/body>
&lt;/html></code>
      </div>
    `
  }
}

export default Markup
