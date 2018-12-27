import Lily from './src/index.js'
import css from 'lily-style'
import HelloWorld from './helloworld.js'
import Counter from './counter.js'
import List from './list.js'

const style = css`
  h2 {
    font-size: 2rem
  }
`

class App extends Lily {
  components () {
    return {
      helloworld: HelloWorld,
      counter: Counter,
      list: List
    }
  }

  data () {
    return {
      title: '🌷 Lily.js',
      style: style
    }
  }

  template () {
    return /* html */`
      <div class="app" :style="style">
        <helloworld></helloworld>

        <h2>{{ title }}</h2>
        <input type="text" bind="title" />

        <counter></counter>
        <list></list>
      </div>
    `
  }
}

Lily.mount(App)
