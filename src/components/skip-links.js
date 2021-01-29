import React from 'react'

import { COLORS, SPACING, Margins } from '@umich-lib/core'
import { Link as GatsbyLink } from 'gatsby'

export default function SkipLinks() {
  return (
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
            <a href="#chat">Skip to Ask a Librarian chat</a>
          </li>
          <li>
            <GatsbyLink to="/site-map">View site map</GatsbyLink>
          </li>
        </ul>
      </Margins>
    </section>
  )
}
