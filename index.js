var Stream = require('stream')
var h = require('h')
var inherits = require('util').inherits
var text = require('text-content')

module.exports = editable

function editable (el) {
  if (!(this instanceof editable)) return new editable(el)

  Stream.call(this)
  this.readable = this.writable = true 

  this.el = el
  this.oldDisplay = el.style.display + ''

  var self = this;
  el.addEventListener('click', function(){
    self.startEdit()
  })
}

inherits(editable, Stream)

// TODO: show a warning when the underlying value changed while editing
editable.prototype.write = function (data) {
  text(this.el, data)
}

editable.prototype.end = function () {
  if (arguments.length) this.write.apply(this, arguments)
  this.writable = false
}

editable.prototype.startEdit = function () {
  var self = this
  
  self.el.style.display = 'none'

  self.input = h('input', { type : 'text', value : text(self.el) })
  self.submit = h('input', { type : 'submit' })

  self.form = h('form.editable',
    {
      submit : function (ev) {
        ev.preventDefault()
        self.endEdit()
      }
    },
    self.input,
    self.submit
  )

  self.el.parentNode.appendChild(self.form)
  self.input.select()
}

editable.prototype.endEdit = function () {
  var update = this.form.elements[0].value

  this.el.parentNode.removeChild(this.form)
  this.form = this.input = this.submit = null

  text(this.el.innerText, update)
  this.el.style.display = this.oldDisplay

  this.emit('data', update)  
}
