import Lily from 'https://unpkg.com/lily@0.2.2/index.js'

class Hero extends Lily {
  template () {
    return /* html */`
      <div class="hero">
        <h1>🌷</h1>
        <h3>Reactive UI components</h3>

        <div class="buttons">
          <a href="#/guide" class="btn primary">Guide</a>
          <a href="#/docs" class="btn outline">Docs</a>
        </div>

        <pre>https://unpkg.com/lily</pre>
      </div>
    `
  }
}

export default Hero
