import Lily from '//unpkg.com/lily'

class Hello extends Lily {
  data () {
    return {
      title: 'Hello, Lily'
    }
  }

  template () {
    return /* html */`
      <div class="column" style="justify-content: center; align-items: center; display: flex; flex-direction: column;">
        <h2>{{ title }}</h2>
        <input type="text" model="title" />
      </div>
    `
  }
}

export default Hello
