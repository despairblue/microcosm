import List  from '../models/list'
import Lists from 'actions/lists'

export default {

  getInitialState() {
    return []
  },

  register() {
    return {
      [Lists.add]    : this.add,
      [Lists.remove] : this.remove
    }
  },

  add(state, params) {
    return state.concat(new List(params))
  },

  remove(state, id) {
    return state.filter(list => list.id !== id)
  }

}
