import { indentationRegex } from "./regex"
import { textToLines, countEmptyLinesBeforeText } from "./utils"

export function dedent(input, options = { trimLeading: false, trimTrailing: false }) {
  let textByLines = textToLines(input)

  const indentations = []
  for (const line of textByLines.filter((line) => line.trim() !== '')) {
    let match = line.match(indentationRegex)
    if (match) {
      indentations.push(match[1].length)
    }
  }

  let globalIndention = 0
  if (indentations.length) {
    globalIndention = Math.min(...indentations)

    const replaceIndentation = new RegExp(`^[\t ]{${globalIndention}}`, 'g')
    for (let i = 0; i !== textByLines.length; i++) {
      textByLines[i] = textByLines[i].replace(replaceIndentation, '')
    }
  }

  let formatted = textByLines.join('\n')
  if (options.trimLeading) {
    formatted = formatted.trimStart()
  }
  if (options.trimTrailing) {
    formatted = formatted.trimEnd()
  }

  const leadingWhitespaces = countEmptyLinesBeforeText(textByLines)
  const trailingWhitespaces = countEmptyLinesBeforeText(textByLines.reverse())

  return {
    formatted,
    globalIndention,
    leadingWhitespaces,
    trailingWhitespaces,
  }
}
