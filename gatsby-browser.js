import React from 'react'
import SkipLinks from './src/components/skip-links'

export const onClientEntry = () => {
  const {
    applyPolyfills,
    defineCustomElements,
  } = require('@umich-lib/components/loader')

  applyPolyfills().then(() => {
    defineCustomElements(window)
  })
}

export const wrapPageElement = ({ element }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <React.Fragment>
      <div
        css={{
          minHeight: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          gridTemplateColumns: '100%',
        }}
      >
        <div>
          <SkipLinks />
          <m-universal-header></m-universal-header>
        </div>
        {element}
      </div>
      <m-chat id="chat"></m-chat>
    </React.Fragment>
  )
}

export const onRouteUpdate = ({ prevLocation }) => {
  const oldPath = prevLocation ? prevLocation.pathname : null

  if (oldPath) {
    const dataPageHeading = document.querySelector('[data-page-heading]')
    const h1 = document.querySelector('h1')
    const pageHeading = dataPageHeading ? dataPageHeading : h1

    if (pageHeading) {
      pageHeading.setAttribute('tabindex', '-1')
      pageHeading.classList.add('focus')
      pageHeading.focus()
    }
  }
}

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (location?.state?.preserveScroll) {
    return false
  }

  return true
}
