import Lily from '//unpkg.com/lily'
import highlite from '//unpkg.com/highlite'

const code = document.createElement('code')
const template = highlite(`
import Lily from '//unpkg.com/lily'

class About extends Lily {
  template () {
    return \`
      <section class="container">
        <h3>Start</h3>
        <p>Lorem ipsum</p>
      <section>
    \`
  }
}

export default About
`.trim(''))

code.innerHTML = template

code.style.whiteSpace = 'pre-wrap'
code.style.display = 'block'

class About extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>about.js</h3>
        ${code.outerHTML}
      </div>
    `
  }
}

export default About
