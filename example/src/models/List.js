import contrast from '../../lib/contrast'

function List({ id, color, name }) {
  this.color    = color || "#777"
  this.contrast = contrast(this.color)
  this.id       = id
  this.name     = name
}

export default List
