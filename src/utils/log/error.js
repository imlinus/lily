import Lily from './../../index.js'

const error = data => {
  let { body, info } = data
  const title = '🥀⚠️ Sorry!'
  info = info || ''
  const css = {
    title: ['color: white', 'font-size: 1.25rem', 'font-weight: bold', 'padding: 0.675rem 0', 'display: block'].join(';'),
    body: ['color: white', 'font-size: 0.75rem', 'padding: 0.675rem 0 0 0'].join(';'),
    info: ['color: white', 'font-size: 0.6rem', 'line-height: 0.75', 'padding: 0.475rem 0 0.675rem 0'].join(';')
  }

  if (!Lily.prototype.config.silent) {
    console.error(`%c${title.trim()}\n%c${body.trim()}\n%c${info.trim()}`, css.title, css.body, css.info)
  }
}

export default error
