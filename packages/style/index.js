const rand = (lng = 9) => {
  if (lng < 1 || lng >= 11) lng = 9
  return Math.random(0x7FFFFFFF).toString(18).slice(2, lng+2)
}

const css = css => {
  console.log(css)
  // const sheet = document.head.appendChild(document.createElement('style'))
  // const styles = interleave(strings, interpolations)
  // const rules = styles.split('}')
  const className = 'li' + rand(5)
  // let style = ''

  // for (let i = 0; i < rules.length - 1; i++) {
  //   style += '.' + className + ' ' + rules[i].trim() + ' }\n'
  // }

  // sheet.innerHTML = style

  return className
}


export default css