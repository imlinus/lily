import is from './../utils/is.js'

const getObj = (obj, root = {}) => {
  if (!obj || is.obj(obj)) return obj
  let clone = JSON.parse(JSON.stringify(obj))

  for (var i in clone) {
    if (typeof clone[i] !== 'object') root[i] = clone[i]
    else if (typeof clone[i] === 'object' && typeof clone[i].___value !== 'undefined') root[i] = clone[i].___value
    else if (is.arr(clone[i])) root[i] = clone[i].splice(0)
    else if (typeof clone[i] === 'object') root[i] = getObj(clone[i], {})
  }

  return root
}

export default getObj
