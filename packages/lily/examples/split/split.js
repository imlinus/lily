import Lily from './lily.js'
import split from './split.html'

class Split extends Lily {
  data () {
    return {
      title: 'Split HTML & JS'
    }
  }

  template () {
    return split
  }
}

export default Split
