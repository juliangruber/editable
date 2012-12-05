var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits
var h = require('h')

module.exports = editable

function editable (el) {
  var self = this
  if (!(self instanceof editable)) return new editable(el)
  EventEmitter.call(self)

  this.el = el
  this.oldDisplay = el.style.display + ''

  el.addEventListener('click', this.startEdit.bind(this))
}

inherits(editable, EventEmitter)

editable.prototype.startEdit = function () {
  var self = this
  
  self.el.style.display = 'none'

  var input = h('input', { type : 'text', value : self.el.innerText })
  var submit = h('input', { type : 'submit' })

  var form = self.form = h('form.editable',
    {
      submit : function (ev) {
        ev.preventDefault()
        self.endEdit()
      }
    },
    input,
    submit
  )

  self.el.parentNode.appendChild(form)
  input.select()
}

editable.prototype.endEdit = function () {
  var update = this.form.elements[0].value

  this.el.parentNode.removeChild(this.form)
  this.el.innerText = update
  this.el.style.display = this.oldDisplay

  this.emit('update', update)  
}
