const net = require('net')

const portr = (port, limit) => {
  return new Promise((resolve, reject) => {
    const maxPort = port + (limit || 5)

    do {
      test(port).then(port => {
        if (port.constructor === Number) resolve(port)
      })

      port++
    } while (port <= maxPort - 1)
  })
}

const test = port => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', () => resolve(false))
    server.listen(port, () => server.close(() => resolve(port)))
  })
}

module.exports = portr
