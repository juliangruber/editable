var h = require('hyperscript');
var inherits = require('inherits');
var text = require('text-content');
var Emitter = require('events').EventEmitter;

module.exports = Editable;
inherits(Editable, Emitter);

function Editable(el){
  if (!(this instanceof Editable)) return new Editable(el);
  Emitter.call(this);
  this.el = el;
  this._bind();
}

Editable.prototype._bind = function(){
  var self = this;
  self.el.addEventListener('click', function(){
    self.edit();
  });
};

Editable.prototype.set = function(value){
  text(this.el, value);
};

Editable.prototype._publish = function(value, cb){
  var self = this;
  var todo = self.listeners('update').filter(function(fn){
    return fn.length > 1;
  });
  if (!todo.length) {
    self.emit('update', value);
    return cb();
  }

  var reject = false;
  self.emit('update', value, function(err){
    if (reject) return;
    if (err) {
      reject = true;
      return cb(err);
    }
    if (!--todo) cb();
  });
};

Editable.prototype.edit = function(){
  var self = this;
  var input = h('input', { type: 'text', value: text(self.el) });
  var submit = h('input', { type: 'submit' });
  var cancel = h('input', { type: 'reset' })
  var form = h('form.editable',
    { onsubmit: onsubmit, onreset: onreset },
    input,
    submit,
    cancel
  );

  function onsubmit(ev){
    ev.preventDefault();
    form.disabled = input.disabled = submit.disabled =
    cancel.disabled = true;
    self._publish(input.value, function(err){
      if (!err) self.set(input.value);
      form.parentNode.replaceChild(self.el, form);
    });
  }

  function onreset(ev){
    form.parentNode.replaceChild(self.el, form);
  }

  self.el.parentNode.replaceChild(form, self.el);
  input.select();
};

