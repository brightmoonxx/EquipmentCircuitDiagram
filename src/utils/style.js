export default function getStyle(style, filter = []) {
  const noNeedUnit = [
    'color',
    'background',
    'backgroundColor',
    'textAlign',
    'opacity',
    'fontWeight',
    'fontFamily',
    'borderColor',
    'textIndent',
    'fontStyle',
    'margin',
    'textShadow'
  ]
  const result = {}
  Object.keys(style).forEach(key => {
    if (!filter.includes(key)) {
      if (key != 'rotate') {
        result[key] = style[key]

        if (!noNeedUnit.includes(key)) {
          result[key] += 'px'
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })

  return result
}
