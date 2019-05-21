const comment = new RegExp(`(?:/(?:^|\s)\/\/(.+?)$/gm)|(?:/\/\*([\S\s]*?)\*\//gm)`, 'gm')

const toComment = cm => `<span style="color: slategray">${cm}</span>`

const defaultColors = ['56b6c2', '61aeee', 'c678dd', '98c379', 'e06c75', 'be5046', 'd19a66', 'e6c07b']

const syntax = (input, { colors = defaultColors } = {}) => {
  let index = 0
  const cache = {}
  const wordRe = /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/
  const leftAngleRe = /</
  const re = new RegExp(`(${wordRe.source}|${leftAngleRe.source})|(${comment})`, 'gmi')

  return input.replace(re, (m, word, cm) => {
    if (cm) return toComment(cm)
    if (word === '<') return '&lt;'

    let color
 
    if (cache[word]) {
      color = cache[word]
    } else {
      color = colors[index]
      cache[word] = color
    }

    const out = `<span style="color: #${color}">${word}</span>`
    index = ++index % colors.length

    return out
  })
}

export default syntax
