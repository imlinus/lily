import Lily from '//unpkg.com/lily'

class Hero extends Lily {
  template () {
    return /* html */`
      <div class="hero">
        <h1>🌷</h1>
        <h3>Reactive UI components</h3>

        <div class="buttons is-centered">
          <button class="is-secondary" @click="guide">Guide</button>
          <button class="button outline" @click="docs">Docs</a>
        </div>

        <pre><a href="//unpkg.com/lily">//unpkg.com/lily</a></pre>
      </div>
    `
  }

  guide () {
    window.location.href = '#/guide'
  }

  docs () {
    window.location.href = '#/docs'
  }
}

export default Hero
