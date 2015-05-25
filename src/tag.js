/**
 * Tag
 * Uniquely tag a function. This is used to identify actions
 */

const uid = require('uid')
const fallback = 'microcosm_action'

module.exports = function(fn) {
  let name = fn.name || fallback
  let mark = uid()

  if (!fn.hasOwnProperty('toString')) {
    fn.toString = () => `${ name }_${ mark }`
  }

  return fn
}
