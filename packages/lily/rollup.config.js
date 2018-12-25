import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify-es'
import pkg from './package.json'
import serve from 'rollup-plugin-serve'

export default [{
  entry: 'src/index.js',
  targets: [{
    dest: pkg.main,
    format: 'cjs'
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
    format: 'cjs'
  }],
  plugins: [
    buble({
      exclude: ['node_modules/**'],
      transforms: { dangerousForOf: true }
    }),
    uglify()
  ]
}]
