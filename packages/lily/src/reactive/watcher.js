import Dep from './dep.js'

class Watcher {
  constructor (vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb

    Dep.target = this
    this.val = this.get()
  }

  get () {
    const val = this.vm[this.exp]
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
