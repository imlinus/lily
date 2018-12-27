const Lily = require('lilyjs')

const templateRE = /((?:.|\n)*?)<template>((?:.|\n)*)<\/template>((?:.|\n)*)/
const scriptRE = /((?:.|\n)*?)<script>((?:.|\n)*)<\/script>((?:.|\n)*)/
const styleRE = /((?:.|\n)*?)<style>((?:.|\n)*)<\/style>((?:.|\n)*)/

module.exports = (name, input, hot) => {
  let HTML = null
  let JS = null
	let CSS = null

  input = input.replace(templateRE, (match, prefix, html, suffix) => {
    HTML = html
    return prefix + suffix
  })

  input = input.replace(scriptRE, (match, prefix, script, suffix) => {
    JS = script
    return prefix + suffix
  })

	input = input.replace(styleRE, (match, prefix, style, suffix) => {
		CSS = style
		return prefix + suffix
  })

  if (JS !== null) {
    const NAME = name.slice(0, -1)

    JS = "import Lily from 'lilyjs' \n" + JS

    JS = JS.replace(
      'export default {',
      'class ' + NAME + ' extends Lily {\n' +
      '  constructor (name) {\n' +
      '    super(name)\n' +
      '  }\n\n' +

      '  template () {\n' +
      '    return `' + HTML + '`\n' +
      '  }\n' +
      '\n' +
    '')
  }

  console.log(JS, CSS)

  return {
		js: JS,
		css: CSS
	}
}
