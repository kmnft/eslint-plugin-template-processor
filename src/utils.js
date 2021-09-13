import { PREFIX, PREFIX_SIZE } from "./prefix"
import { newLineRegex, isBlockRegex  } from "./regex"

export function textToLines (text, substringFrom = 0, substringTo = null){
    const substring = substringTo !== null
      ? text.substring(substringFrom, substringTo)
      : text.substring(substringFrom)

    return substring.split(newLineRegex)
}

export function countEmptyLinesBeforeText(input) {
  let emptyLines = []
  for (let i = 0; i != input.length; i++) {
    if (input[i].trim() !== '') {
      break
    }
    emptyLines.push(input[i] + '\n')
  }
  return emptyLines
}

export function adjustLine(block, message) {
  let { line } = message

  // Adjust lines by adding chars count before block start
  line += textToLines(block.source, 0, block.ranges.start).length

  // Add whitespaces count
  line += block.whitespaces.leading.length

  // Exclude prefix
  line -= PREFIX_SIZE

  return line
}

export function adjustColumn(block, message) {
  let { column } = message

  if (column > 1) {
    column -= 1
  }
  // Add indention length
  column += block.globalIndention

  return column
}

export function adjustRange(block, message) {
  let [rangeStart, rangeEnd] = message.fix.range

  const linesStart = textToLines(block.text, 0, rangeStart)
  const linesEnd = textToLines(block.text, 0, rangeEnd)

  // Count indentions by multiplying global indention size by count of lines excluding prefix
  const startIndentions = (linesStart.length - 1) * block.globalIndention
  const endIndentions = (linesEnd.length - 1) * block.globalIndention

  // Exclude prefix
  rangeStart -= PREFIX.length
  rangeEnd -= PREFIX.length

  // Append indention
  rangeStart += startIndentions
  rangeEnd += endIndentions

  // Adjust lines by adding chars count before block start
  rangeStart += block.ranges.start,
  rangeEnd += block.ranges.start

  // Adjust lines by adding length of trimmed whitespaces
  let whitespaceLength = block.whitespaces.leading
    .map((line) => line.length)
    .reduce((curr, prev) => curr + prev, 0)

  rangeStart += whitespaceLength
  rangeEnd += whitespaceLength

  return [rangeStart, rangeEnd]
}

export function flatArray(array) {
  return [].concat(...array)
}

export function getBlockIndexFromFilename(filename) {
  const index = filename.match(isBlockRegex)
  if (index !== null) {
    return index[1] - 1
  }
  return undefined
}

export default {
  adjustColumn,
  adjustLine,
  textToLines,
  countEmptyLinesBeforeText,
}
