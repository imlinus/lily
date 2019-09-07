import observe from './observe.js'

class Component {
  constructor (vm, $props) {
    const {
      data,
      props,
      components,
      template,
      beforeMount,
      mounted,
      destroyed
    } = vm.__proto__
    this.$vm = vm

    // Name
    this.$name = vm.$name

    if (data) this.$data = observe(data(), state => {
      if (state) {
        console.log(state)
      }
    })

    // Template
    if (!template) throw new Error('You need a template')
    this.$template = this.html(template(this.values, this.$data).flat(Infinity).join(''))

    this.initializeElement(this)
  }

  values (strings, ...values) {
    return strings.flatMap(str => [str].concat(values.shift()))
  }

  html (html) {
    if (!html) return
    const el = document.createElement('html')
    el.innerHTML = html.trim()
    return el.children[1].firstChild
  }

  initializeElement ($vm) {
    customElements.define(
      $vm.$name,
      class extends HTMLElement {
        constructor () {
          super()
        }

        connectedCallback () {
          if ($vm.beforeMount) $vm.beforeMount()
          this.outerHTML = $vm.$template.outerHTML
          if ($vm.mounted) $vm.mounted()
        }

        disconnectedCallback () {
          if ($vm.destroyed) $vm.destroyed()
        }
      }
    )
  }
}

export default Component
