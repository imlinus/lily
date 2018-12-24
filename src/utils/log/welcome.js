import Lily from './../../index.js'

const welcome = obj => {
  const title = '🌷 Lily.js'
  const info = 'More info:'
  const link = 'https://github.com/imlinus/lily'
  const css = {
    title: ['color: white', 'font-size: 1.5rem', 'font-weight: bold', 'padding: 0.675rem 0 0.475rem'].join(';'),
    info: ['color: white', 'font-size: 0.75rem', 'padding: 0'].join(';'),
    link: ['color: white', 'font-size: 0.75rem', 'padding: 0.25rem 0 0.675rem'].join(';')
  }

  if (!Lily.prototype.config.silent) {
    console.log(`%c${title.trim()}\n%c${info.trim()}\n%c${link.trim()}\n`, css.title, css.info, css.link, obj)
  }
}

export default welcome
