import { PREFIX, POSTFIX } from './prefix'
import { adjustLine, adjustColumn, flatArray, getBlockIndexFromFilename } from './utils'
import { templateRegex, isBlockRegex } from './regex'
import { dedent } from './dedent'
import { map, mapBuilder } from './map'

export default {
  "template-processor": {
    preprocess(text, filename) {
      map[filename] = map[filename] || mapBuilder(text)

      // eslint-disable-next-line
      while (true) {
        let result = templateRegex.exec(text)
        if (result === null) {
          break
        }

        const dedented = dedent(result[1], {
          trimLeading: true,
          trimTrailing: true
        })

        map[filename].blocks.push({
          source: text,
          text: PREFIX + dedented.formatted + POSTFIX,
          globalIndention: dedented.globalIndention,
          whitespaces: {
            leading: dedented.leadingWhitespaces,
            trailing: dedented.trailingWhitespaces,
          },
          ranges: {
            start: result.index,
            end: result.index + result[1].length
          },
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

      const messagesList = flatArray(messages)
      for (const message of messagesList) {
        if (!isBlock) {
          continue
        }
        const block = map[basename].blocks[
          getBlockIndexFromFilename(filename)
        ]
        message.line = adjustLine(block, message)
        message.column = adjustColumn(block, message)
      }

      return messagesList
    },
  },
}
