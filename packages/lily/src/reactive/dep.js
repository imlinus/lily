class Dep {
  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  notify () {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update()
    }
  }
}

export default Dep
