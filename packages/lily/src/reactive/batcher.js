let q = new Set()

const nextTick = cb => {
  Promise.resolve().then(cb)
}

const flush = args => {
  q.forEach(watcher => watcher.run())
  q = new Set()
}

const queue = watcher => {
  q.add(watcher)
  nextTick(flush)
}

export default queue
