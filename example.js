const StatefulPromise = require('vue-reactive-stateful-promise')

// Simple example
{
  const p = new StatefulPromise((res) => {
    setTimeout(res, 10)
  })

  console.log(p.isPending) // true
  console.log(p.isResolved) // false
  console.log(p.isRejected) // false

  p.abort()

  console.log(p.isRejected) // true
}
