export const disabledRules = [
  "prettier/prettier",
  "vue/comment-directive"
]
export default (message) => disabledRules.includes(message.ruleId)
