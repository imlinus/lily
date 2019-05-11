import uglify from 'rollup-plugin-uglify-es'
import serve from 'rollup-plugin-serve'
import buble from 'rollup-plugin-buble'
import pkg from './package.json'

export default [{
  entry: 'src/index.js',
  targets: [{
    name: 'Lily',
    dest: pkg.main,
    format: 'esm'
  }],
  plugins: [
    buble({
      exclude: ['node_modules/**'],
      transforms: {
        dangerousForOf: true
      },
      objectAssign: 'Object.assign'
    }),
    serve({
      open: true,
      contentBase: ['./', 'dist', 'examples', 'src'],
    })
  ]
}, {
  entry: 'src/index.js',
  targets: [{
    name: 'Lily',
    dest: pkg.min,
    format: 'esm'
  }],
  plugins: [
    buble({
      exclude: ['node_modules/**'],
      transforms: {
        dangerousForOf: true
      },
      objectAssign: 'Object.assign'
    }),
    uglify()
  ]
}]
