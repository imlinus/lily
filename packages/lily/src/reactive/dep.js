class Dep {
  constructor () {
    this.subs = new Map()
  }

  addSub (key, sub) {
    const curr = this.subs.get(key)

    if (curr) curr.add(sub)
    else this.subs.set(key, new Set([sub]))
  }

  notify (key) {
    if (this.subs.get(key)) {
      this.subs.get(key).forEach(sub => sub.update())
    }
  }
}

export default Dep
