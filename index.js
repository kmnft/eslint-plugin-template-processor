const dedent = require('dedent')

const templateRegex = /template:\s*(?:`)((?:\n|[^`])*)(?:`)(?:}|,)/gm
const isBlockRegex = /\/(\d+)_\//
const newLineRegex = /\r\n|\r|\n/

const map = {}
const mapBuilder = (text) => ({
  input: text,
  symbols: text.length,
  lines: text.split(newLineRegex).length,
  blocks: [],
})

const textToLines = (text, substringFrom = 0, substringTo) => {
  const substring = substringTo !== null
    ? text.substring(substringFrom, substringTo)
    : text.substring(substringFrom)

  return substring.split(newLineRegex)
}

const adjustLine = (baseLine, offsetLine) => {
  return baseLine + offsetLine - 1;
}

const adjustColumn = (column) => {
  return +column > 1 ? column - 1 : column
}

module.exports = {
  processors: {
    "template-processor": {
      preprocess(text, filename) {
        map[filename] = map[filename] || mapBuilder(text)

        let blockIndex = 1
        while (true) {
          result = templateRegex.exec(text)
          if (result === null) {
            break
          }

          const blockText = dedent(result[1])
          map[filename].blocks.push({
            input: text,
            blockIndex: blockIndex++,
            text: blockText,
            ranges: [
              result.index,
              result.index + blockText.length
            ],
            filename
          })
        }

        return [{ text, filename }, ...map[filename].blocks]
      },
      postprocess(messages, filename) {
        const isBlock = isBlockRegex.test(filename)

        const basename = isBlock
          ? filename.split(isBlockRegex)[0]
          : filename

        const messagesList = [].concat(...messages)
        for (const message of messagesList) {
          if (!isBlock) {
            continue
          }
          const block = map[basename].blocks[filename.match(isBlockRegex)[1] - 1]

          const [rangeStart] = block.ranges
          const linesBeforeBlock = textToLines(block.input, 0, rangeStart)

          message.line = adjustLine(linesBeforeBlock.length, message.line)
          message.column = adjustColumn(message.column)
        }

        return messagesList
      },
    },
  },
};
