import Lily from '//unpkg.com/lily'
import Brand from './brand.js'
import Navigation from './navigation.js'

class Navbar extends Lily {
  components () {
    return {
      brand: Brand,
      navigation: Navigation
    }
  }

  template () {
    return /* html */`
      <div class="topbar is-fixed nav">
        <brand brand="Lily.js"></brand>        
        <navigation></navigation>
      </div>
    `
  }

  mounted () {
    document.documentElement.classList.add('has-fixed-topbar')
  }
}

export default Navbar
