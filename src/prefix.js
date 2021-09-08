import { newLineRegex } from "./regex"

export const PREFIX = '<template>\n'
export const POSTFIX = '\n</template>'
export const PREFIX_SIZE = PREFIX.split(newLineRegex).length

export default {
  PREFIX,
  POSTFIX,
  PREFIX_SIZE
}
