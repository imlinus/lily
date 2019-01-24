import getObj from './get-obj.js'

let watch = (obj, oldObj, target, name, val) => {
  if (obj && obj.watch && typeof obj.watch === 'function') {
    obj.watch(getObj(obj), getObj(target), name, val)
  }
}

export default watch
