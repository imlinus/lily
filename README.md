# Lily.js

This is just my Hobby UI framework, not done by a long shot :P

```js
import { mount, Component } from '//unpkg.com/lily'

class App extends Component {
  state () {
    return {
      title: 'Hello, World.'
    }
  }

  hello () {
    console.log('Hello')
  }

  template (html) {
    const { title } = this.$state

    return html`
      <div>
        <h1>${title}</h1>
        <button @click="hello">Hello</button>
      </div>
    `
  }
}

mount(App)
```

Cheers

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)
