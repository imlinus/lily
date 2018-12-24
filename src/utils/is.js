import config from './../config.js'

const elementNode = node => node.nodeType === 1
const textNode = node => node.nodeType === 3

const modelDirective = val => val === config.symbol.model
const loopDirective = val => val === config.symbol.loop
const eventDirective = val => val.indexOf(config.symbol.event) !== -1
const bindDirective = val => val.startsWith(config.symbol.bind)

const type = (val, type) => val.constructor === type

export {
  elementNode,
  textNode,
  modelDirective,
  loopDirective,
  eventDirective,
  bindDirective,
  type
}
