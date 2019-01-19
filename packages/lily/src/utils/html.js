const html = html => {
  if (!html) return

  const el = document.createElement('html')
  el.innerHTML = html.trim()

  return el.children[1].firstChild
}

export default html
