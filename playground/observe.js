const debounce = cb => {
  let timer

  return function () {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      cb.apply(this, arguments)
      timer = null
    })
  }
}

const observe = (obj, cb) => {
  const callback = debounce(cb)
  const proxy = new Proxy(obj, {
    get: function (o, k) {
      return o[k]
    },
    set: function (o, k, v) {
      if (o[k] !== v) {
        o[k] = v
        callback(o)
      }

      return true
    }
  })

  cb(proxy)
  return proxy
}

export default observe
