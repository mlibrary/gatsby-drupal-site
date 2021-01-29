const request = require('request')
const fs = require('fs')
const readline = require('readline')

/**
 * Redirects are managed in Drupal. This function downloads it
 * from the appropriate CMS server and makes it available in
 * the public directory, so that Netlify can use it.
 *
 * Production _redirects file: https://cms.lib.umich.edu/_redirects
 * Netlify redirect docs: https://docs.netlify.com/routing/redirects/
 */
async function createNetlifyRedirectsFile({ baseUrl }) {
  const dir = 'public'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const firstRedirectLine =
    'https://umich-lib.netlify.app/* https://lib.umich.edu/:splat 301!'
  const filePath = dir + '/_redirects'

  let redirectsFile = fs.createWriteStream(filePath)

  await new Promise((resolve, reject) => {
    request({
      uri: baseUrl + '/_redirects',
    })
      .pipe(redirectsFile)
      .on('finish', () => {
        const data = fs.readFileSync(filePath, 'utf8')
        /**
         * Just to be sure as a basic check, check if the
         * file contains the first redirect.
         */
        const isValid = data.startsWith(firstRedirectLine)

        if (isValid) {
          console.log('[redirects] _redirects file was successfully created.')
          resolve()
        } else {
          const msg = `[redirects] Error: Expected the first redirect line to be: ${firstRedirectLine}`
          throw msg
        }
      })
      .on('error', error => {
        console.log('[redirects] had an error creating the file.')
        reject(error)
      })
  }).catch(error => {
    const msg = `[redirects] Error: ${error}`
    throw msg
  })
}

exports.createNetlifyRedirectsFile = createNetlifyRedirectsFile

/*
  https://www.gatsbyjs.org/packages/gatsby-plugin-client-side-redirect/
*/
function createLocalRedirects({ createRedirect }) {
  console.log('[redirects] Creating local redirects.')

  const readInterface = readline.createInterface({
    input: fs.createReadStream('public/_redirects'),
  })

  readInterface.on('line', function(line) {
    if (line) {
      const urls = line.split(' ')
      /**
       * Is a local redirect and not
       * a wildcard redirect.
       */
      if (urls[0].startsWith('/') && !urls[0].endsWith('/*')) {
        /*
        console.log('[redirect] URL:')
        console.log(' - from: ' + urls[0])
        console.log(' - to: ' + urls[1])
        */

        /**
         * Creates at `fromPath` a page with:
         * <meta http-equiv="refresh" content="0; URL='/new-url/'" />
         */
        createRedirect({
          fromPath: urls[0],
          toPath: urls[1],
          isPermanent: true,
          redirectInBrowser: true,
        })
      }
    }
  })
}

exports.createLocalRedirects = createLocalRedirects
