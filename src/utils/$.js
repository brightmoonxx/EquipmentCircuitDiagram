export default function $(className, key, value) {
  if (value) {
    return (document.querySelector(className).style[key] = value)
  } else if (key) {
    return document.querySelector(className).style[key]
  } else {
    return document.querySelector(className)
  }
}
