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
  this.form = null;
}

Editable.prototype._createForm = function(initialText){
  var self = this;
  var input = h('input', { type: 'text', value: initialText });
  var submit = h('input', { type: 'submit' });
  var cancel = h('input', { type: 'reset' })
  self.form = h('form.editable',
    { onsubmit: onsubmit, onreset: onreset },
    input,
    submit,
    cancel
  );

  function onsubmit(ev){
    ev.preventDefault();
    self.form.disabled = input.disabled = submit.disabled =
    cancel.disabled = true;
    self._publish(input.value, function(err){
      if (!err) self.set(input.value);
      self.form.parentNode.replaceChild(self.el, self.form);
      self.emit('postupdate', input.value);
      self.form = null;

    });
  }
  function onreset(ev){
  	self.reset();
  }


  self.el.parentNode.replaceChild(self.form, self.el);
  input.select();
}
Editable.prototype.isEditing = function () {
	return this.form !== null;
}

Editable.prototype.reset = function(){
  this.form.parentNode.replaceChild(this.el, this.form);
  this.form = null;
}

Editable.prototype._bind = function(){
  var self = this;
  self.el.addEventListener('click', function(){
    var todo = self.listeners('prefill').filter(function(fn){
      return fn.length > 1;
    });
    if (!todo.length) {
    	self._createForm(text(self.el));
    }
    else {
      self.emit('prefill', text(self.el), function(err, newText){
      	if (err) {
      		
      	}
      	else {
        	self._createForm(newText);
      	}
      });
    }
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

