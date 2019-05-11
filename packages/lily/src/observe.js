const REVEAL_ADD_DEEP_CALLBACK = '__REVEAL_ADD_DEEP_CALLBACK__'
const REVEAL_ADD_FLAT_CALLBACK = '__REVEAL_ADD_FLAT_CALLBACK__'
const REVEAL_REMOVE_DEEP_CALLBACK = '__REVEAL_REMOVE_DEEP_CALLBACK__'
const REVEAL_REMOVE_FLAT_CALLBACK = '__REVEAL_REMOVE_FLAT_CALLBACK__'

export function observe (target, emit) {
  const proxies = {}

  let flatCallbaks = []
  let deepCallbaks = []

  return new Proxy(target || {}, {
    get (obj, prop, receiver) {
      const reflected = Reflect.get(...arguments)

      if (typeof reflected === 'object' || typeof reflected === 'undefined') {
        return proxies[prop] || (
          proxies[prop] = observe(reflected || {}, function (eObj, eOldObj, eProp) {
            const oldValue = {
              ...obj,
              [prop]: eOldObj
            }
            const newValue = {
              ...obj,
              [prop]: eObj
            }

            if (deepCallbaks.length) {
              deepCallbaks.forEach(c => c(newValue, oldValue, prop + '.' + eProp))
            }

            if (typeof emit === 'function') {
              emit(newValue, oldValue, prop + '.' + eProp)
            }
          })
        )
      }

      return reflected
    },
    set (obj, prop, value) {
      if (prop === REVEAL_ADD_FLAT_CALLBACK) {
        return flatCallbaks.push(value)
      }

      if (prop === REVEAL_ADD_DEEP_CALLBACK) {
        return deepCallbaks.push(value)
      }

      if (prop === REVEAL_REMOVE_FLAT_CALLBACK) {
        return flatCallbaks = flatCallbaks.filter(c => c !== value)
      }

      if (prop === REVEAL_REMOVE_DEEP_CALLBACK) {
        return deepCallbaks = deepCallbaks.filter(c => c !== value)
      }

      const oldValue = obj[prop]
      const oldObj = {
        ...obj
      }

      const reflected = Reflect.set(...arguments)

      if (reflected && (value !== oldValue)) {
        if (flatCallbaks.length) {
          flatCallbaks.forEach(c => c(obj, oldObj, prop))
        }
        if (deepCallbaks.length) {
          deepCallbaks.forEach(c => c(obj, oldObj, prop))
        }
        if (typeof emit === 'function') {
          emit(obj, oldObj, prop)
        }
      }

      return reflected
    }
  })
}

export function watcher (target, handler, options) {
  options = {
    deep: false,
    immediate: false,
    ...options
  }

  const props = options.deep
    ? { add: REVEAL_ADD_DEEP_CALLBACK, remove: REVEAL_REMOVE_DEEP_CALLBACK }
    : { add: REVEAL_ADD_FLAT_CALLBACK, remove: REVEAL_REMOVE_FLAT_CALLBACK }

  target[props.add] = handler

  if (options.immediate) {
    handler(target)
  }

  return function revoke () {
    target[props.remove] = handler
  }
}
