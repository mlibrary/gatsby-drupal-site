const COLORS = require('@umich-lib/core').COLORS
const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/'
console.log(`Using DRUPAL_URL: '${DRUPAL_URL}'`)

const siteMetadata = {
  title: 'University of Michigan Library',
  siteUrl: 'https://www.lib.umich.edu',
}

module.exports = {
  siteMetadata,
  plugins: [
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteMetadata.siteUrl,
        sitemap: siteMetadata.siteUrl + '/sitemap.xml',
        resolveEnv: () => {
          /**
           *
           * Assume development env for robots.txt unless explicity
           * set to production with ROBOTSTXT_MODE env var.
           */
          let mode = 'development'

          /**
           * Only is the mode in production when Netlify is deploying from
           * the sites production branch and ROBOTSTXT_MODE is set to production.
           */
          if (
            process.env.ROBOTSTXT_MODE === 'production' &&
            process.env.CONTEXT === 'production'
          ) {
            mode = 'production'
          }

          console.log(`[gatsby-plugin-robots-txt] is in ${mode} mode.`)

          return mode
        },
        env: {
          production: {
            policy: [
              {
                userAgent: '*',
                allow: '/',
              },
            ],
          },
          development: {
            policy: [
              {
                userAgent: '*',
                disallow: ['/'],
                host: null,
                sitemap: null,
              },
            ],
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-react-helmet-canonical-urls`,
      options: {
        siteUrl: siteMetadata.siteUrl,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: DRUPAL_URL,
        apiBase: `jsonapi`,
        concurrentFileRequests: 10,
        filters: {
          page: 'filter[field_redirect_node]=0',
        },
      },
    },
    {
      resolve: 'gatsby-source-umich-lib',
      options: {
        baseUrl: DRUPAL_URL,
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-serviceworker',
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'University of Michigan Library',
        short_name: 'U-M Library',
        start_url: '/',
        background_color: COLORS.blue['400'],
        theme_color: COLORS.maize['400'],
        display: 'minimal-ui',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        languages: [{ name: 'en' }],
        fields: [
          {
            name: 'title',
            store: true,
            attributes: { boost: 9 },
          },
          {
            name: 'summary',
            store: true,
            attributes: { boost: 3 },
          },
          {
            name: 'keywords',
            store: true,
          },
        ],
        resolvers: {
          SitePage: {
            title: node => (node.context ? node.context.title : null),
            summary: node => (node.context ? node.context.summary : null),
            keywords: node => (node.context ? node.context.keywords : null),
          },
        },
      },
    },
  ],
}
