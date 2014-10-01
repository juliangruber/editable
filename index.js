var Stream = require('stream');
var h = require('h');
var inherits = require('util').inherits;
var text = require('text-content');

module.exports = Editable;

function Editable (el){
  if (!(this instanceof Editable)) return new Editable(el);

  Stream.call(this);
  this.readable = this.writable = true;

  this.el = el;
  this.oldDisplay = el.style.display + '';

  var self = this;
  el.addEventListener('click', function(){
    self.startEdit();
  });
}

inherits(Editable, Stream);

Editable.prototype.write = function (data) {
  text(this.el, data);
};

Editable.prototype.end = function () {
  if (arguments.length) this.write.apply(this, arguments);
  this.writable = false;
};

Editable.prototype.startEdit = function () {
  var self = this;
  
  self.el.style.display = 'none';

  self.input = h('input', { type : 'text', value : text(self.el) });
  self.submit = h('input', { type : 'submit' });

  self.form = h('form.Editable',
    {
      submit : function (ev) {
        ev.preventDefault();
        self.endEdit();
      }
    },
    self.input,
    self.submit
  );

  self.el.parentNode.appendChild(self.form);
  self.input.select();
};

Editable.prototype.endEdit = function () {
  var update = this.form.elements[0].value;

  this.el.parentNode.removeChild(this.form);
  this.form = this.input = this.submit = null;

  text(this.el.innerText, update);
  this.el.style.display = this.oldDisplay;

  this.emit('data', update);
};

