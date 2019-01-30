// TODO: Rebuild this one, also. wtfck is the set-immediate crap

import './set-immediate.js'

const watchers = new WeakMap()
const dispatch = Symbol()
const isWatching = Symbol()
const timer = Symbol()
const isArray = Symbol()
const changes = Symbol()

const API = {
  watch (fn) {
    if (typeof fn !== 'function') throw `Sorry`

    if (!watchers.has(this)) watchers.set(this, [])
    watchers.get(this).push(fn)

    return this
  },

  unwatch (fn) {
    const callbacks = watchers.get(this)
    if (!callbacks) return

    if (fn) {
      const index = callbacks.indexOf(fn)
      if (~index) callbacks.splice(index, 1)
    } else watchers.set(this, [])

    return this
  },

  json () {
    return Object.keys(this).reduce((ret, key) => {
      const value = this[key]
      ret[key] = value && value.json ? value.json() : value
      return ret
    }, this[isArray] ? [] : {})
  }
}

const TRAPS = {
  set (target, property, value) {
    if (target[property] !== value) {
      if (
        value === Object(value) &&
        !value[isWatching]
      ) {
        target[property] = icaro(value)
      } else {
        target[property] = value
      }

      target[dispatch](property, value)
    }

    return true
  }
}

const define = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    value: value,
    enumerable: false,
    configurable: false,
    writable: false
  })
}

const enhance = obj => {
  Object.assign(obj, {
    [changes]: new Map(),
    [timer]: null,
    [isWatching]: true,
    [dispatch]: (property, value) => {
      if (watchers.has(obj)) {
        clearImmediate(obj[timer])
        obj[changes].set(property, value)
        obj[timer] = setImmediate(() => {
          watchers.get(obj).forEach(fn => fn(obj[changes]))
          obj[changes].clear()
        })
      }
    }
  })

  Object.keys(API).forEach(key => {
    define(obj, key, API[key].bind(obj))
  })

  if (Array.isArray(obj)) {
    obj[isArray] = true
    obj.forEach((item, i) => {
      obj[i] = null
      TRAPS.set(obj, i, item)
    })
  }

  return obj
}

const observe = obj => {
  return new Proxy(
    enhance(obj || {}),
    Object.create(TRAPS)
  )
}

export default observe
