const templateRegex = /template:\s*(?:`)((?:\n|[^`])*)(?:`)(?:}|,)/gm

const generateMapToFile = (text) => {
  const lines = text.split('\n')
  return {
    input: text,
    chars: text.length,
    lines: lines.length,
    blocks: [],
    ranges: []
  }
}

const mapBlockLineToFileLine = (blockLine, textLine, text) => {
  return text.substring(0, textLine).split('\n').length + blockLine - 1
}

const map = {}
module.exports = {
  processors: {
    "template-processor": {
      preprocess(text, filename) {
        console.log(filename)
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
        // for (let index = 0; index != messages.length; index++) {
          // for (const block of messages[index]) {
          // }
        // }
        // const blocks = [].concat(...messages)
        // for (let index = 0; index != blocks.length; index++) {
        //   // blocks[index].column =
        //   //   blocks[index].column > 1 ? blocks[index].column - 1 : 1
        //   // blocks[index].line = mapBlockLineToFileLine(
        //   //   blocks[index].line,
        //   //   map[filename].ranges[index][0],
        //   //   map[filename].input,
        //   // )
        // }
        // return blocks
        return [].concat(...messages)
      },
    },
  },
};
