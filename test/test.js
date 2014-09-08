var test = require('tape')
var h = require('h')
var editable = require('../')
var text = require('text-content')

test('editable', function (t) {
  t.plan(3)

  var parent = h('div')
  var dom = h('span', 'some text')
  parent.appendChild(dom)

  var el = editable(dom)

  el.on('data', function (update) {
    t.equal(update, 'it changed', 'stream received data')
  })

  el.startEdit()
  t.equal(el.input.value, 'some text', 'input changed')
  el.input.value = 'it changed'
  el.endEdit()

  el.write('and again')
  t.equal(text(dom), 'and again', 'el changed')
  t.end()
})
