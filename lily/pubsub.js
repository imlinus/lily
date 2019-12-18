class PubSub {
  constructor () {
    this.events = {}
  }

  on (name, callback) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    this.events[name].push(callback)
  }

  emit (name) {
    const args = Array.prototype.slice.call(arguments, 1)

    if (this.events[name]) {
      for (var i = 0; i < this.events[name].length; i++) {
        this.events[name][i].apply(null, args)
      }
    }
  }
}

export default PubSub
