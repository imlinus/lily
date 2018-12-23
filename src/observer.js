import Dep from './dep.js'

const observe = data => {
  if (!data || typeof data !== 'object') return

  Object.keys(data).forEach(key => {
    defineObserver(data, key, data[key])
  })
}

const defineObserver = (data, key, val) => {
  observe(val)
  let dep = new Dep()

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get () {
      if (Dep.target) dep.addWatcher(Dep.target)

      return val
    },

    set (newVal) {
      if (val === newVal) return
      val = newVal
      dep.notify()
    }
  })
}
