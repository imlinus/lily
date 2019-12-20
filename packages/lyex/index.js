import PubSub from './pubsub.js'

class Lyex {
  constructor (data) {
    this.actions = {}
    this.mutations = {}
    this.state = {}
    this.events = new PubSub()
    this.status = 'relaxing'
    const self = this

    if (data.hasOwnProperty('actions')) {
      this.actions = data.actions
    }

    if (data.hasOwnProperty('mutations')) {
      this.mutations = data.mutations
    }

    this.state = new Proxy((data.state || {}), {
      get (state, key) {
        return state[key]
      },

      set (state, key, value) {
        if (state[key] !== value) {
          state[key] = value
          self.events.emit('stateChange', self.state)
        }

        return true
      }
    })
  }

  commit (mutation, payload) {
    if (typeof this.mutations[mutation] !== 'function') return false

    this.status = 'mutation'
    const state = this.mutations[mutation](this.state, payload)
    this.state = Object.assign(this.state, state)

    return true
  }

  dispatch (action, payload) {
    if (typeof this.actions[action] !== 'function') return false

    this.status = 'action'
    this.actions[action](this, payload)

    return true
  }
}

export default Lyex
