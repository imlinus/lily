# Lily.js

This is just my Hobby UI framework, not done by a long shot :P

Example: https://codepen.io/imlinus/pen/abzJwVw

```js
import Lily from '//unpkg.com/lily'
import HelloWorld from './hello-world.js'

class App extends Lily.Component {
  state () {
    return {
      title: 'Hello, World.'
    }
  }

  components () {
    return {
      HelloWorld
    }
  }

  template () {
    const { title } = this.$state

    return /* html */`
      <div>
        <h1>{{ title }}</h1>
        <input model="title" />

        <hello-world></hello-world>
      </div>
    `
  }
}

Lily.mount(App)
```

Cheers

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)
