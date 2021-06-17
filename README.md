vue-reactive-stateful-promise
================
[![Build](https://github.com/Tofandel/vue-reactive-stateful-promise/actions/workflows/test.yml/badge.svg)](https://github.com/Tofandel/vue-reactive-stateful-promise/actions)
[![npm version](https://badge.fury.io/js/vue-reactive-stateful-promise.svg)](https://www.npmjs.com/package/vue-reactive-stateful-promise)
[![dependencies](https://status.david-dm.org/gh/tofandel/vue-reactive-stateful-promise.svg)](https://david-dm.org/tofandel/vue-reactive-stateful-promise)

Native Promise wrapper with reactive state getters
(`isPending`, `isResolved`, `isRejected`).

Installation
------------

    npm install vue-reactive-stateful-promise

Usage
-----

```js
import StatefulPromise from 'vue-reactive-stateful-promise';
```

### Constructor

Create a new promise the same way as you would with the `Promise` constructor:

```js

  let p = new StatefulPromise((res, rej) => {
    // ...
  });

  p.isPending; // true
  p.isResolved; // false
  p.isRejected; // false
```

Pass in an async function:

```js

  let p = new StatefulPromise(async () => {
    // ...
  });

  p.isPending; // true
  p.isResolved; // false
  p.isRejected; // false
```

Extend an existing promise:

```js
  let pr = new Promise((resolve, reject) => {
    setTimeout(resolve, 10);
  });

  let p = new StatefulPromise(pr);

  p.isPending; // true
  p.isResolved; // false
  p.isRejected; // false
```

Also works with `Promise` static methods:

```js
  let p = StatefulPromise.resolve('foo');

  p.isPending; // false
  p.isResolved; // true
  p.isRejected; // false
```

### Options

The constructor also accept options

```js
  let p = new StatefulPromise((res, rej) => {
    setTimeout(res, 2000);
  }, {timeout: 1000, ignoreAbort: true});
  
  p.abort(); // This will do nothing
  
  p.catch((e) => {
    console.error(e); // Will return Error: Promise timed out
  });
```
  

License
-------
This software is released under the terms of the **GPL 3.0 license**. See `LICENSE`. 
