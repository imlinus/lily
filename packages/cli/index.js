#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')
const exec = require('child_process').exec

const nameRE = /{{ name }}/g
const name = process.argv[2]
const repo = {
  method: 'GET',
  host: 'api.github.com',
  path: '/repos/imlinus/lily/tarball/master',
  headers: { 'User-Agent': 'Node.js' }
}

const rand = (lng = 9) => {
  if (lng < 1 || lng >= 11) lng = 9
  return Math.random(0x7FFFFFFF).toString(18).slice(2, lng)
}

const download = res => {
  const archive = path.join(__dirname, 'lily.tar.gz')
  const stream = fs.createWriteStream(archive)

  res.on('data', chunk => stream.write(chunk))

  res.on('end', () => {
    stream.end()
    install(archive)
  })
}

const install = archive => {
  const target = path.join(process.cwd(), name)
  const tmp = 'lily-' + rand(9)

  exec(`mkdir ${tmp} && tar -xvf ${archive} -C ${tmp} --strip=1`, err => {
    if (err) throw err
    exec(`mkdir ${target} && mv ${tmp}/packages/seed/* ${target} && rm -rf ${tmp}`, err => {
      if (err) throw err
      clean(archive, target)
    })
  })
}

const clean = (archive, target) => {
  fs.unlink(archive, err => {
    if (err) throw err

    create(target, target)
    console.log('\x1b[32m✔\x1b[0m Done!')
    console.log(`Run:
\x1b[34m$\x1b[0m cd ${name}
\x1b[34m$\x1b[0m npm i
\x1b[34m$\x1b[0m npm start
    `)
  })
}

const create = (current, target) => {
  const files = fs.readdirSync(current)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const next = path.join(current, file)

    if (fs.statSync(next).isDirectory()) {
      create(next, target)
    } else {
      fs.writeFileSync(next, fs.readFileSync(next).toString().replace(nameRE, name))
      // console.log('Created:', path.relative(target, next))
    }
  }
}

https.get(repo, res => {
  if (
    res.statusCode > 300 &&
    res.statusCode < 400 &&
    res.headers.location !== undefined
  ) {
    https.get(res.headers.location, redir => download(redir))
  } else {
    download(res)
  }
})
