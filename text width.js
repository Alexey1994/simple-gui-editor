var textWidthElement = document.createElement('span')
var textWidthElementStyle = textWidthElement.style
textWidthElementStyle.position = 'fixed'
textWidthElementStyle.top = '-100%'
document.body.appendChild(textWidthElement)

function getTextWidth(text) {
    textWidthElement.innerHTML = text
    return textWidthElement.clientWidth
}