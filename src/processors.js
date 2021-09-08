import { textToLines, adjustLine, adjustColumn } from './utils.js'
import { templateRegex, newLineRegex, isBlockRegex } from './regex.js'
import { dedent } from './dedent.js'
import { PREFIX, POSTFIX } from './prefix'

const map = {}
const mapBuilder = (text) => ({
  input: text,
  symbols: text.length,
  lines: text.split(newLineRegex).length,
  blocks: [],
})

// TODO: overall refactor
// FIXME: vue/comment-directive fix
// FIXME: prettier fix

export const processors = {
  "template-processor": {
    preprocess(text, filename) {
      map[filename] = map[filename] || mapBuilder(text)

      let blockIndex = 1
      while (true) {
        let result = templateRegex.exec(text)
        if (result === null) {
          break
        }

        const dedented = dedent(
          result[1],
          {
            trimLeading: true,
            trimTrailing: true
          }
        )
        map[filename].blocks.push({
          text: PREFIX + dedented.formatted + POSTFIX,
          globalIndention: dedented.globalIndention,
          leadingWhitespaces: dedented.leadingWhitespaces,
          trailingWhitespaces: dedented.trailingWhitespaces,
          blockIndex: blockIndex++,
          ranges: [
            result.index,
            result.index + result[1].length
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

      const messagesList = []
      for (const message of [].concat(...messages)) {
        if (!isBlock) {
          continue
        }
        const block = map[basename].blocks[filename.match(isBlockRegex)[1] - 1]
        const linesBeforeBlock = textToLines(map[basename].input, 0, block.ranges[0])

        message.line = adjustLine(
          linesBeforeBlock.length,
          message.line + block.leadingWhitespaces
        )
        message.column = adjustColumn(message.column + block.globalIndention)

        messagesList.push(message)
      }

      return messagesList
    },
  },
}

export default {
  processors
}
