import uglify from 'rollup-plugin-uglify-es'
import serve from 'rollup-plugin-serve'
import buble from 'rollup-plugin-buble'
import pkg from './package.json'

export default [{
  entry: 'src/index.js',
  targets: [{
    dest: pkg.main,
    format: 'es'
  }],
  plugins: [
    buble({
      exclude: ['node_modules/**'],
      transforms: { dangerousForOf: true }
    }),
    serve({
      open: true,
      contentBase: ['./', 'dist', 'examples', 'src'],
    })
  ]
}, {
  entry: 'src/index.js',
  targets: [{
    dest: pkg.min,
    format: 'es'
  }],
  plugins: [
    buble({
      exclude: ['node_modules/**'],
      transforms: { dangerousForOf: true }
    }),
    uglify()
  ]
}]
