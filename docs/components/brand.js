import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Brand extends Lily {
  props () {
    return {
      brand: {
        type: String,
        default: 'Lily'
      }
    }
  }

  template () {
    return /* html */`
      <div class="navbar-brand">
        <h1 class="text-white">{{ brand }}</h1>
      </div>
    `
  }
}

export default Brand
