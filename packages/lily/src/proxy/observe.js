import Observer from './observer.js'

const observe = obj => {
  let newState = {}

  try {
    return new Observer(obj, newState, newState)
  } catch (e) {
    return obj
  }
}

export default observe
