import Dep from './dep.js'
import pushQueue from './batcher.js'

class Watcher {
  constructor (vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get()
  }

  get () {
    const exp = this.exp
    let val
    Dep.target = this

    if (typeof exp === 'function') {
      val = exp.call(this.vm)
    } else if (typeof exp === 'string') {
      val = this.vm[exp]
    }
  
    Dep.target = null
    return val
  }

  update () {
    pushQueue(this)
  }

  run () {
    const val = this.get()
    this.cb.call(this.vm, val, this.value)
    this.value = val
  }

  // constructor (vm, exp, cb) {
  //   this.vm = vm
  //   this.exp = exp
  //   this.cb = cb

  //   Dep.target = this
  //   this.getTextContent()
  //   Dep.target = null
  // }

  // update () {
  //   this.cb(this.getTextContent())
  // }

  // getTextContent () {
  //   return this.exp.replace(/\s+/g, '').split('.').reduce((sum, current) => {
  //     return sum[current]
  //   }, this.vm)
  // }
}

export default Watcher

// import Dep from './dep.js'

// class Watcher {
//   constructor (vm, exp, cb) {
//     this.vm = vm
//     this.exp = exp
//     this.cb = cb

//     Dep.target = this
//     this.val = this.get()
//   }

//   get () {
//     const val = this.vm[this.exp]
//     Dep.target = null

//     return val
//   }

//   update () {
//     const newVal = this.get()
//     const oldVal = this.val

//     if (newVal === oldVal) return

//     this.val = newVal
//     this.cb.call(this.vm, newVal, oldVal)
//   }
// }

// export default Watcher
