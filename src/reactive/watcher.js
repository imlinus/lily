import Dep from './dep.js'

class Watcher {
  constructor (view, expr, cb) {
    this.view = view
    this.expr = expr
    this.cb = cb

    Dep.target = this
    this.val = this.get()
  }

  get () {
    const val = this.view[this.expr]
    Dep.target = null

    return val
  }

  update () {
    const newVal = this.get()
    const oldVal = this.val

    if (newVal === oldVal) return

    this.val = newVal
    this.cb.call(this.vm, newVal, oldVal)
  }
}

export default Watcher
