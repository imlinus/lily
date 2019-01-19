import Dep from './dep.js'

const Observer = obj => {
  const dep = new Dep()

  return new Proxy(obj, {
    get (target, key, receiver) {
      if (Dep.target) dep.addSub(key, Dep.target)

      return Reflect.get(target, key, receiver)
    },

    set (target, key, value, receiver) {
      if (Reflect.get(receiver, key) === value) return
  
      const res = Reflect.set(target, key, observ(value), receiver)
      dep.notify(key)

      return res
    }
  })
}

const observ = obj => {
  if (!Object.prototype.toString.call(obj) === '[object Object]') return obj

  Object.keys(obj).forEach(key => {
    obj[key] = observ(obj[key])
  })

  return Observer(obj)
}

export default observ
