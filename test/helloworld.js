class HelloWorld {
  constructor () {
    this.data = this.data()
    this.template = this.template()

    return this
  }

  data() {
    return {
      title: 'Hello, World.'
    }
  }

  beforeMount () {
    console.log('HelloWorld.js Before Mount')
  }

  mounted () {
    console.log('HelloWorld.js Mounted')
  }

  template () {
    const { title } = this.data

    return /* html */`
      <div class="hello-world">
        <h2>{{ title }}</h2>
      </div>
    `
  }
}

export default HelloWorld
