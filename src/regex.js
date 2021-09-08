export const templateRegex = /template:\s*(?:`)((?:\n|[^`])*)(?:`)(?:}|,)/gm
export const isBlockRegex = /\/(\d+)_\//
export const newLineRegex = /\r\n|\r|\n/
export const indentationRegex = /^([ \t]+)/

export default {
  templateRegex,
  isBlockRegex,
  newLineRegex,
  indentationRegex
}
