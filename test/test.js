var assert = require('assert')
var editable = require('../')

console.log('tests start')

var updates = editable(document.querySelector('span'))

// perform tests on first update only
var first = true

updates.on('update', function (update) {
  console.log('update: ' + update)
  if (!first) return
  assert.equal(update, 'it changed')
  console.log('all tests passed')
  first = false
})

updates.startEdit()

var input = document.querySelector('.editable input')
var form = document.querySelector('.editable form')

assert.equal(input.value, 'some text')

input.value = 'it changed'
updates.endEdit()
