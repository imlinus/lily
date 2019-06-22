class Component {
  constructor (vm) {
    const {
      name,
      components,
      template,
      beforeMount,
      mounted,
      destroyed
    } = vm.__proto__
    const $vm = this

    // Name
    if (!name) throw new Error('You need a name :-D')
    this.name = name()

    // Template
    if (!template) throw new Error('You need a template :-D')
    this.template = this.html(template())

    // Components
    if (components) this.components = components()

    // LifeCycle Hooks
    if (beforeMount) this.beforeMount = beforeMount
    if (mounted) this.mounted = mounted
    if (destroyed) this.destroyed = destroyed

    this.initializeElement($vm)
  }

  initializeElement ($vm) {
    customElements.define(
      $vm.name,
      class extends HTMLElement {
        constructor () {
          super()
          if ($vm.beforeMount) $vm.beforeMount()
        }

        connectedCallback () {
          this.outerHTML = $vm.template.outerHTML
          $vm.walkNodes($vm.template)
          if ($vm.mounted) $vm.mounted()
        }

        disconnectedCallback () {
          if ($vm.destroyed) $vm.destroyed()
        }
      }
    )
  }

  html (html) {
    if (!html) return
    const el = document.createElement('html')
    el.innerHTML = html.trim()
    return el.children[1].firstChild
  }

  walkNodes (node) {
    if (!node) return

    node.childNodes.forEach(child => {
      if (
        child.nodeType === 1 &&
        this.components &&
        this.components.hasOwnProperty(child.localName)
      ) {
        new this.components[child.localName]()
      }
    })
  }
}

export default Component
