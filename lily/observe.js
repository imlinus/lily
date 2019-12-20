const observe = (data, events) => {
  return new Proxy({}, {
    get (state, key) {
      return state[key]
    },

    set (state, key, value) {
      if (state[key] !== value) {
        state[key] = value
        events.emit('stateChange', value)
      }

      return true
    }
  })
}

export default observe
