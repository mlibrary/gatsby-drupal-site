const fetch = require('fetch-retry')

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  { api, client }
) => {
  reporter.info(`[gatsby-source-libguides] Started ...`)
  if (!api.url || !client.url || !client.id || !client.secret) {
    reporter.error(
      `[gatsby-source-libguides]`,
      new Error('Not configured. Exiting ...')
    )

    return // Tell Gatsby we're done.
  }

  async function clientTokenFetch() {
    const bodyObj = {
      client_id: client.id,
      client_secret: client.secret,
      grant_type: 'client_credentials',
    }
    const bodyKeys = Object.keys(bodyObj).map(key => `${key}=${bodyObj[key]}`)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyKeys.join('&'),
    }

    return fetch(client.url, options)
      .then(function(resp) {
        return resp.json()
      })
      .then(function(data) {
        return data
      })
      .catch(function() {
        reporter.error(
          `[gatsby-source-libguides]`,
          new Error('Unable to authenticate.')
        )
      })
  }

  const clientData = await clientTokenFetch()

  async function fetchGuides() {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${clientData.access_token}`,
      },
    }

    return fetch(api.url, options)
      .then(function(resp) {
        return resp.json()
      })
      .then(function(data) {
        return data
      })
      .catch(function() {
        reporter.error(
          `[gatsby-source-libguides]`,
          new Error('Unable to fetch from API.')
        )
      })
  }

  const guidesData = await fetchGuides()

  /*
    Source node time!
  */

  const { createNode } = actions

  guidesData.forEach(guide => {
    const nodeContent = JSON.stringify(guide)
    const nodeMeta = {
      id: createNodeId(`libguide-${guide.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'LibGuide',
        content: nodeContent,
        contentDigest: createContentDigest(guide),
      },
    }
    const node = Object.assign({}, guide, nodeMeta)
    createNode(node)
  })

  reporter.info(`[gatsby-source-libguides] Done.`)

  return // Tell Gatsby we're done sourcing nodes.
}
