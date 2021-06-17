import tap from 'tap'
import StatefulPromise, { isAsync } from '../index.mjs'
import Vue from 'vue'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

tap.test('constructor function', async (t) => {
  const p = new StatefulPromise((resolve) => {
    setTimeout(resolve, 100)
  })
  t.equal(p.isPending, true)
  t.equal(p.isResolved, false)
  t.equal(p.isRejected, false)

  await sleep(110)

  t.equal(p.isPending, false)
  t.equal(p.isResolved, true)
  t.equal(p.isRejected, false)

  const p2 = new StatefulPromise(p)
  t.equal(p2.isPending, false)
  t.equal(p2.isResolved, true)
  t.equal(p2.isRejected, false)
})

tap.test('constructor async', async (t) => {
  const p = new StatefulPromise(async () => {
    await sleep(100)
  })

  t.equal(p.isPending, true)
  t.equal(p.isResolved, false)
  t.equal(p.isRejected, false)

  await sleep(110)

  t.equal(p.isPending, false)
  t.equal(p.isResolved, true)
  t.equal(p.isRejected, false)
})

tap.test('constructor promise', async (t) => {
  const p = new StatefulPromise(new Promise(resolve => {
    setTimeout(resolve, 100)
  }))

  t.equal(p.isPending, true)
  t.equal(p.isResolved, false)
  t.equal(p.isRejected, false)

  await sleep(110)

  t.equal(p.isPending, false)
  t.equal(p.isResolved, true)
  t.equal(p.isRejected, false)
})

tap.test('abort', async (t) => {
  let catchCount = 0
  let p = new StatefulPromise((resolve) => {
    setTimeout(resolve, 100)
  })
  p.catch(() => catchCount++)
  t.equal(catchCount, 0)
  p.abort()
  await sleep(1)
  t.equal(catchCount, 1)
  p.abort()
  await sleep(1)
  t.equal(catchCount, 1)

  catchCount = 0
  p = new StatefulPromise((resolve) => {
    setTimeout(resolve, 10)
  })
  p.catch(() => catchCount++)

  await sleep(15)
  t.equal(catchCount, 0)
  p.abort()
  await sleep(1)
  t.equal(catchCount, 0)
})

tap.test('options', async (t) => {
  let catchCount = 0
  let p = new StatefulPromise((resolve) => {
    setTimeout(resolve, 100)
  }, { timeout: 20, ignoreAbort: true })
  p.catch(() => catchCount++)
  p.abort()
  await sleep(1)
  t.equal(catchCount, 0)
  t.equal(p.isRejected, false)

  await sleep(30)

  t.equal(catchCount, 1)
  t.equal(p.isRejected, true)

  catchCount = 0
  p = new StatefulPromise(() => {
  }, { timeout: 0 })
  p.catch(() => catchCount++)

  await sleep(500)
  t.equal(p.isPending, true)

  p.abort()
  await sleep(1)
  t.equal(p.isPending, false)
})

tap.test('reactivity', async (t) => {
  const promise = new StatefulPromise((resolve) => {
    setTimeout(resolve, 20)
  })
  const v = new Vue({
    computed: {
      promiseIsPending () {
        return promise.isPending
      },
      promiseIsResolved () {
        return promise.isResolved
      },
      promiseIsRejected () {
        return promise.isRejected
      }
    }
  })
  t.equal(v.promiseIsPending, true)
  t.equal(v.promiseIsResolved, false)
  t.equal(v.promiseIsRejected, false)
  await sleep(25)
  t.equal(v.promiseIsPending, false)
  t.equal(v.promiseIsResolved, true)
  t.equal(v.promiseIsRejected, false)
})

tap.equal(isAsync(async () => ({})), true)
tap.equal(isAsync((res) => res()), false)
