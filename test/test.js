var test = require('tape')
var editable = require('../')

test('editable', function (t) {
  t.plan(2)

  var el = document.createElement('span')
  el.innerText = 'some text'

  var updates = editable(el)

  updates.on('update', function (update) {
    t.equal(update, 'it changed')
    t.end()
  })

  updates.startEdit()

  var form = el.parentNode.childNodes[1]
  var input = form.childNodes[0]

  t.equal(input.value, 'some text')

  input.value = 'it changed'
  updates.endEdit()
})
