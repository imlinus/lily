import Dep from './dep.js'

const observe = data => {
  if (!data || typeof data !== 'object') return

  const keys = Object.keys(data)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    defineReactive(data, key, data[key])
  }
}

const defineReactive = (target, key, val) => {
  const dep = new Dep()
  observe(val)

  Object.defineProperty(target, key, {
    configurable: false,
    enumerable: true,
    get () {
      Dep.target && dep.addSub(Dep.target)
      return val
    },
    set (newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify()
    }
  })
}

export default observe
