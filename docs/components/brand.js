import Lily from '//unpkg.com/lily'

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
        <h2 class="text-white">{{ brand }}</h2>
      </div>
    `
  }
}

export default Brand
