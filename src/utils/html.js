const html = html => {
  const tmp = document.createElement('template')
  tmp.innerHTML = html.trim()

  return tmp.content.firstChild
}

export default html
