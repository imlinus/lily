import Lily from '//unpkg.com/lily'

class Footer extends Lily {
  template () {
    return /* html */`
      <footer class="footer has-text-center">
        <div>
          Made with <span class="text-danger">❤</span> by <a href="//github.com/imlinus/">Linus</a> & <a href="https://github.com/imlinus/lily-css/graphs/contributors">contributors</a>
        </div>
      
        <div>
          <a href="//github.com/imlinus/lily">GitHub</a>
        </div>
      </footer>
    `
  }
}

export default Footer
