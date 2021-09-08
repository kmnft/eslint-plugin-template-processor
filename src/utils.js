import { newLineRegex  } from "./regex.js"
import { PREFIX_SIZE } from "./prefix.js"

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

export function adjustLine(baseLine, offsetLine) {
  return baseLine + offsetLine - PREFIX_SIZE;
}

export function adjustColumn(column) {
  return column > 1 ? column - 1 : column
}

export default {
  adjustColumn,
  adjustLine,
  textToLines,
  countEmptyLinesBeforeText,
}
