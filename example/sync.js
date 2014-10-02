var editable = require('..');

var el = document.createElement('span');
el.appendChild(document.createTextNode('Click me! :D'));
document.body.appendChild(el);

var ed = editable(el);

window.ed = ed;
console.log('try ed.set("value")');

ed.on('update', function(value){
  console.log('value', value);
});
