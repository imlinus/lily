export default {
  elementNode: node => node.nodeType === 1,
  textNode: node => node.nodeType === 3,
  obj: obj => obj != null && typeof obj === 'object',
  arr: arr => Array.isArray(arr)
}
