var editable = require('..');

var el = document.createElement('span');
el.appendChild(document.createTextNode('Click me! :D'));
document.body.appendChild(el);

var ed = editable(el);

window.ed = ed;
console.log('try ed.set("value")');

ed.on('update', function(value, done){
  if (Math.random() > 0.5) {
    setTimeout(done, 1000);
  } else {
    setTimeout(function(){
      done(new Error)
    }, 500);;
  }
});
