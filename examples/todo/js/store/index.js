import Lyex from './../../../../packages/lyex/index.js'

import actions from './actions.js'
import mutations from './mutations.js'
import state from './state.js'

const store = new Lyex({
  actions,
  mutations,
  state
})

export default store
