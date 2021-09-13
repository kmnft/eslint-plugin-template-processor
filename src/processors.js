import { PREFIX, POSTFIX } from './prefix'
import { adjustLine, adjustColumn, flatArray, getBlockIndexFromFilename, adjustRange } from './utils'
import { templateRegex, isBlockRegex } from './regex'
import { dedent } from './dedent'
import { map, mapBuilder } from './map'
import ignoreMessage from './disabledRules'

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
        const nonCaptureGroup = result[1]
        const templateGroup = result[2]

        const dedented = dedent(templateGroup, {
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
            start: nonCaptureGroup.length + result.index,
            end: nonCaptureGroup.length + result.index + templateGroup.length
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
        if (message.fix) {
          message.fix.range = adjustRange(block, message)
        }
      }

      return messagesList.filter((message) => !ignoreMessage(message))
    },
    supportsAutofix: true,
  },
}
