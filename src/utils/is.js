const elementNode = node => node.nodeType === 1
const textNode = node => node.nodeType === 3
const type = (val, type) => val.constructor === type

export {
  elementNode,
  textNode,
  type
}
