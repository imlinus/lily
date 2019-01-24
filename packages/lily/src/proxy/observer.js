import is from './../utils/is.js'
import handler from './handler.js'

class Observer {
  constructor (obj, data, orgObj) {
    if (is.obj(obj) && !is.arr(obj)) {
      let keys = Object.keys(obj)

      for (var i = 0; i < keys.length; i++) {
        if (typeof obj[keys[i]] === 'object') data[keys[i]] = new Observer(obj[keys[i]], {}, orgObj)
        else data[keys[i]] = obj[keys[i]]
      }

      return new Proxy(data, handler(orgObj || obj))
    }

    if (is.arr(obj)) return new Proxy(obj, handler(orgObj|| obj))
    if (!is.obj(obj)) return obj
  }
}

export default Observer
