import Vue from 'vue'

const StatefulPromise = Object.setPrototypeOf(function (promise, options = {}) {
  // Don't modify any promise that has been already modified.
  if (promise instanceof Promise && promise.isPending !== undefined) return promise

  options = { ignoreAbort: false, timeout: 60000, ...options }

  const pr = new Vue({
    data () {
      return {
        isResolved: false,
        isRejected: false
      }
    },
    methods: {
      abort (e = 'Promise aborted') {
        !options.ignoreAbort && this.reject(new Error(e))
      }
    }
  })

  const prom = new Promise((resolve, reject) => {
    if (typeof promise === 'function') {
      promise = new Promise((resolve, reject) => {
        promise(resolve, reject)?.then(resolve, reject)
      })
    }
    let t = null
    const reslve = (...args) => {
      t && clearTimeout(t)
      pr.isResolved = true
      resolve(...args)
    }
    const rejct = (...args) => {
      if (!pr.isResolved && !pr.isRejected) {
        t && clearTimeout(t)
        pr.isRejected = true
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(...args)
      }
    }
    if (options.timeout) {
      t = setTimeout(() => {
        rejct(new Error('Promise timed out'))
      }, options.timeout)
    }
    pr.reject = rejct
    promise.then(reslve, rejct)
  })

  Object.defineProperties(prom, {
    isResolved: { enumerable: false, get: () => pr.isResolved },
    isPending: { enumerable: false, get: () => !pr.isResolved && !pr.isRejected },
    isRejected: { enumerable: false, get: () => pr.isRejected },
    abort: { enumerable: false, value: pr.abort }
  })

  return prom
}, Promise)

export default StatefulPromise
