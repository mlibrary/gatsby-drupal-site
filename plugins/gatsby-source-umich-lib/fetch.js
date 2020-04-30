const fetch = require('fetch-retry')
const Bottleneck = require('bottleneck/es5')

function fetchWithRetry(url) {
  console.log(url)
  return fetch(url, {
    retries: 15,
    retryOn: [500],
    retryDelay: function(attempt) {
      return Math.pow(2, attempt) * 1000 // 1000, 2000, 4000
    },
  }).then(function(response) {
    return response.json()
  })
}

const limiter = new Bottleneck({
  maxConcurrent: 10,
})

const fetchWithRetryAndLimited = limiter.wrap(fetchWithRetry)

exports.fetch = fetchWithRetryAndLimited
