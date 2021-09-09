import { PREFIX_SIZE } from "./prefix"
import { newLineRegex, isBlockRegex  } from "./regex"

export function textToLines (text, substringFrom = 0, substringTo = null){
    const substring = substringTo !== null
      ? text.substring(substringFrom, substringTo)
      : text.substring(substringFrom)

    return substring.split(newLineRegex)
}

export function countEmptyLinesBeforeText(input) {
  let count = 0
  for (let i = 0; i != input.length; i++) {
    if (input[i].trim() !== '') {
      break
    }
    count++
  }
  return count
}

export function adjustLine(block, message) {
  const startLineSource = textToLines(block.source, 0, block.ranges.start).length
  return startLineSource +
         block.whitespaces.leading +
         message.line -
         PREFIX_SIZE
}

export function adjustColumn(block, message) {
  const { globalIndention: indention } = block
  const { column } = message
  return (column > 1 ? column - 1 : column) + indention
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
