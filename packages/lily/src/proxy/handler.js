import is from './../utils/is.js'
import getObj from './get-obj.js'
import Observer from './observer.js'
import watch from './watch.js'

let handler = data => {
  return {
    get: (target, prop, receiver) => target[prop],

    deleteProperty: (target, property) => {
      let deleted
      let oldVal = getObj(data)

      if (is.obj(target) || is.arr(target)) deleted = delete target[property]

      watch(data, oldVal, target, property)
      return deleted
    },

    set: (target, name, val) => {
      let oldVal = getObj(data)

      if (is.arr(target) && name === 'length') {
        target[name] = val
        return target
      }

      if (is.arr(val)) target[name] = new Proxy(val, handler)
      if (is.obj(val) && !is.arr(val)) target[name] = new Observer(val, {}, data)
      if (!is.obj(val)) target[name] = val

      watch(data, oldVal, target, name, val)

      return target
    }
  }
}

export default handler
