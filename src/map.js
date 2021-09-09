import { newLineRegex  } from "./regex"

export const map = {}
export function mapBuilder(text) {
  return {
    input: text,
    symbols: text.length,
    lines: text.split(newLineRegex).length,
    blocks: [],
  }
}

export default {
  map,
  mapBuilder
}
