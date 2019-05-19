const observe = (data, emit) => {
  const proxies = {}
  let flat = []
  let deep = []

  return new Proxy(data || {}, {
    get (obj, key, receiver) {
      const reflected = Reflect.get(...arguments)

      if (typeof reflected === 'object' || typeof reflected === 'undefined') {
        return proxies[key] || (
          proxies[key] = observe(reflected || {}, ($obj, $old, prop) => {
            const old = { ...obj, [key]: $old }
            const val = { ...obj, [key]: $obj }

            if (deep.length) deep.forEach(c => c(val, old, key + '.' + prop))
            if (typeof emit === 'function') emit(val, old, key + '.' + prop)
          })
        )
      }

      return reflected
    },

    set (obj, key, val) {
      if (key === 'addFlat') return flat.push(val)
      if (key === 'addDeep') return deep.push(val)
      if (key === 'rmFlat') return flat = flat.filter(c => c !== val)
      if (key === 'rmDeep') return deep = deep.filter(c => c !== val)

      // console.log(obj, key, val)

      const oldVal = obj[key]
      const oldObj = { ...obj }
      const reflected = Reflect.set(...arguments)

      if (reflected && (val !== oldVal)) {
        if (flat.length) flat.forEach(c => c(obj, oldObj, key))
        if (deep.length) deep.forEach(c => c(obj, oldObj, key))
        if (typeof emit === 'function') emit(obj, oldObj, key)
      }

      return reflected
    }
  })
}

const watcher = (target, handler, opts) => {
  opts = {
    deep: false,
    immediate: false,
    ...opts
  }

  const props = {
    add: (opts.deep ? 'addDeep' : 'addFlat'),
    remove: (opts.deep ? 'rmDeep' : 'rmFlat')
  }

  target[props.add] = handler
  if (opts.immediate) handler(target)

  return function revoke () {
    target[props.remove] = handler
  }
}

export { observe, watcher }
