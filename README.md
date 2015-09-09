
# editable

Turn DOM-Elements into streams that

* emit updates through in place editing
* update their innerText when written to

![preview](http://i.imgur.com/5OYHO.png)

In place editing starts on click and ends on form submit or reset

## usage

```js
var el = document.querySelector('#el');
var ed = editable(el);

ed.on('update', function(value){
  console.log('new value', value);
});

// also works well with async ops,
// in which cause it disables the
// form until the op is done

ed.on('update', function(value, done){
  save(value, function(err){
    done(err);
  });
});
```

## api

### var ed = editable(el)

Turn `el` into a editable element.

### ed.on('update', fn)

The event is emitted every time the user submits a new value.

You can pass a second `Function` argument as a callback when listening, in which case `editable` waits for the callback to be called.

### ed.set(value)

Manually update the value.

### ed.edit()

Manually activate edit mode and focus the input.

## installation

```bash
$ npm install editable
```

and bundle with browserify

## license

(MIT)

Copyright (c) 2012 &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
