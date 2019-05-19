class LilyRouter {
  constructor (routes) {
    this.active = '/'
    this.routes = {}
    this.el = document.querySelector('[router]')
    
    if (this.el instanceof HTMLElement) {
      this.init(routes)
    }
  }

  init (routes) {
    Object.keys(routes).forEach(key => { this.routes[key] = routes[key] })
    window.addEventListener('hashchange', this.update.bind(this))
    if (location.hash.slice(1) !== '/') location.hash = '#/'
    this.update()
  }

  update () {
    this.active = location.hash.slice(1)
    while (this.el.firstChild) this.el.removeChild(this.el.firstChild)
    const child = document.createElement('div')
    this.el.appendChild(child)
    new this.routes[this.active](child).template()
  }

  push (path) {
    location.hash = path
  }
}

export default LilyRouter
