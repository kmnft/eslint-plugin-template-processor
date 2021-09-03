const templateRegex = /template:\s*(?:`)((?:\n|[^`])*)(?:`)(?:}|,)/gm

const generateMapToFile = (text) => ({
  input: text,
  chars: text.length,
  lines: text.split('\n').length,
  blocks: [],
  ranges: []
})

const mapBlockLineToFileLine = (blockLine, textLine, text) => {
  return text.substring(0, textLine).split('\n').length + blockLine - 1
}

const map = {}
module.exports = {
  processors: {
    "template-processor": {
      preprocess(text, filename) {
        if (!map[filename]) {
          map[filename] = generateMapToFile(text)
        }

        while(true) {
          let result = templateRegex.exec(text)
          if (result === null) {
            break
          }
          const block = { text: result[1], filename }
          const range = [
            result.index,
            result.index + block.text.length
          ]
          map[filename].ranges.push(range)
          map[filename].blocks.push(block)
        }
        return map[filename].blocks;
      },
      postprocess(messages, filename) {
        for (let blockIdx = 0; blockIdx != messages.length; blockIdx++) {
          for (let messageIdx = 0; messageIdx != messages[blockIdx].length; messageIdx++) {
            messages[blockIdx][messageIdx].column = messages[blockIdx][messageIdx].column > 1
              ? messages[blockIdx][messageIdx].column - 1
              : 1
            messages[blockIdx][messageIdx].line = mapBlockLineToFileLine(
              messages[blockIdx][messageIdx].line,
              map[filename].ranges[blockIdx][0],
              map[filename].input,
            )
          }
        }
        return [].concat(...messages)
      },
    },
  },
};
