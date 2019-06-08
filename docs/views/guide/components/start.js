import Lily from '//unpkg.com/lily'
import highlite from '//unpkg.com/highlite'

const code = document.createElement('code')
const template = highlite(`
import Lily from '//unpkg.com/lily'

class Start extends Lily {
  template () {
    return \`
      <section class="container">
        <h3>Start</h3>
        <p>Lorem ipsum</p>
      <section>
    \`
  }
}

export default Start
`.trim(''))

code.innerHTML = template

code.style.whiteSpace = 'pre-wrap'
code.style.display = 'block'

class Start extends Lily {
  template () {
    return /* html */`
      <div>
        <h3>start.js</h3>
        ${code.outerHTML}
      </div>
    `
  }
}

export default Start
