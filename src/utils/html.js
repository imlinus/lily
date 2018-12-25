const html = html => {
  if (!html) return

  const el = document.createElement('html')
  // const tmp = document.createElement('template')
  el.innerHTML = html.trim()

  return el.children[1].firstChild
  // return el.firstChild
}

export default html
