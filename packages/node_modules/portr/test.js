const portr = require('./index')
const port = 1234

portr(port).then(port => {
  console.log('First available port', port) // 1235
})
