/* Original snippet: https://github.com/lukeed/sublet/ */

const debounce = fn => {
  var timer

	return function () {
    var args = arguments

    if (timer) clearTimeout(timer)

		timer = setTimeout(() => {
			fn.apply(this, args)
			timer = null
		})
	}
}

const proxy = (obj, fn) => {
  const cb = debounce(fn)

	const proxy = new Proxy(obj, {
		get (obj, key) {
			return obj[key]
		},
		set (obj, key, val) {
			if (obj[key] !== val) {
				obj[key] = val
				cb(obj)
      }

			return true
		}
  })

	fn(proxy)
	return proxy
}

export default proxy
