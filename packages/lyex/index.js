let store = {}

export default {
  get (key) {
    return !store[key] ? undefined : store[key].val
  },

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

  listen (key, cb, opts = {}) {
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

const callSubs = (key, val, old) => {
  const subs = store[key].subs

  for (let i = 0; i < subs.length; i++) {
    const cb = subs[i]
    if (cb.constructor === Function) cb(val, old)
  }
}
