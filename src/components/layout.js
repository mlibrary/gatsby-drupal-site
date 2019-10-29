import React from 'react'
import PropTypes from 'prop-types'
import { Global } from '@emotion/core'
import {
  UniversalHeader,
  GlobalStyleSheet,
  COLORS,
  SPACING,
  Margins,
} from '@umich-lib/core'
import { Link as GatsbyLink } from 'gatsby'
import Header from './header'
import Footer from './footer'
import DevelopmentAlert from './development-alert'
import useNavigationData from '../hooks/use-navigation-data'

function Layout({ children, drupalNid }) {
  const { primary, secondary } = useNavigationData()

  return (
    <React.Fragment>
      <GlobalStyleSheet />
      <Global
        styles={{
          'html, body, #___gatsby, #___gatsby > div': {
            height: '100%',
          },
          '*:focus': {
            outlineColor: COLORS.blue['400'],
          },
        }}
      />
      <div
        css={{
          minHeight: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateColumns: '100%',
        }}
      >
        <section
          aria-label="Skip links"
          css={{
            background: COLORS['blue']['400'],
            ':focus-within': {
              padding: `${SPACING['M']} 0`,
              position: 'static',
              width: 'auto',
              height: 'auto',
              a: {
                color: 'white',
                textDecoration: 'underline',
                padding: SPACING['XS'],
              },
              'ul > li:not(:last-of-type)': {
                marginBottom: SPACING['M'],
              },
              li: {
                textAlign: 'center',
              },
            },
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            '*:focus': {
              outlineColor: 'white',
            },
          }}
        >
          <Margins>
            <ul>
              <li>
                <a href="#maincontent">Skip to main content</a>
              </li>
              <li>
                <a href="#ask-a-librarian-chat">
                  Skip to Ask a Librarian chat
                </a>
              </li>
              <li>
                <GatsbyLink to="/site-map">View site map</GatsbyLink>
              </li>
            </ul>
          </Margins>
        </section>
        <section>
          <DevelopmentAlert />
          <UniversalHeader />
          <Header primary={primary} secondary={secondary} />
        </section>
        <main id="maincontent">{children}</main>
        <Footer />
      </div>
      {drupalNid && (
        <div
          css={{ display: 'none' }}
          id="drupalNid"
          data-drupal-nid={drupalNid}
        />
      )}
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
