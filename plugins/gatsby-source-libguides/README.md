# LibGuides Gatsby Plugin

Configure the plugin in `gatsby-config.js` then set these env variables to use this plugin.

```js
{
  resolve: 'gatsby-source-libguides',
  options: {
    api: {
      url: process.env.LIBGUIDES_API_URL,
    },
    client: {
      url: process.env.LIBGUIDES_CLIENT_URL,
      id: process.env.LIBGUIDES_CLIENT_ID,
      secret: process.env.LIBGUIDES_CLIENT_SECRET,
    },
  },
}
```

```
LIBGUIDES_API_URL=https://lgapi-us.libapps.com/1.2/az
LIBGUIDES_CLIENT_URL=https://lgapi-us.libapps.com/1.2/oauth/token
LIBGUIDES_CLIENT_ID=
LIBGUIDES_CLIENT_SECRET=
```

And set a value for `LIBGUIDES_CLIENT_ID` and `LIBGUIDES_CLIENT_SECRET`.

- https://www.gatsbyjs.org/docs/environment-variables/#example-of-using-an-environment-variable
- https://umich.libapps.com/libguides/
