class Dep {
  constructor () {
    this.deps = []
  }

  addWatcher (watcher) {
    this.deps.push(watcher)
  }

  notify () {
    this.deps.forEach(watcher => {
      watcher.update()
    })
  }
}

Dep.target = null

export default Dep
