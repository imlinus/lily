import Dep from './dep.js'

class Watcher {
  constructor (vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.val = this.get()
  }

  update () {
    let oldVal = this.val
    let newVal = this.vm.data[this.exp]
    if (oldVal === newVal) return

    this.val = newVal
    this.cb.call(this.vm, newVal)
  }

  get () {
    Dep.target = this
    let val = this.vm.data[this.exp]
    Dep.target = null

    return val
  }
}

export default Watcher
