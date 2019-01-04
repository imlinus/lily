let store = {}

const callSubs = (key, newVal, prevVal) => {
  const subs = store[key].subs

  for (let i = 0; i < subs.length; i++) {
    const cb = subs[i]
    if (typeof cb === 'function') cb(newVal, prevVal)
  }

  // store[key].subs.forEach(cb => {
  //   if (typeof cb === 'function') cb(newVal, prevVal)
  // })
}

const lyex = {
  set (key, val) {
    let currVal = undefined

    if (!store[key]) {
      store[key] = {
        val: val,
        subs: []
      }
    } else {
      currVal = store[key].val
      store[key].val = val
    }

    callSubs(key, val, currVal)
  },

  get (key) {
    return !store[key] ? undefined : store[key].val
  },

  subscribe (key, cb, opts = {}) {
    let i = 1

    if (!store[key]) {
      store[key] = {
        val: undefined,
        subs: [cb]
      }
    } else {
      i = store[key].subs.push(cb)
    }

    if (opts.callback) cb(this.get(key))

    return () => {
      delete store[key].subs[i - 1]
    }
  }
}

export default lyex
