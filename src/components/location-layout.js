import React from 'react'

import {
  Margins,
  SPACING,
  MEDIA_QUERIES,
  COLORS
} from '@umich-lib/core'

export function Template({ children }) {
  return (
    <div
      css={{
        marginTop: SPACING['2XL'],
        [MEDIA_QUERIES.LARGESCREEN]: {
          display: "grid",
          gridTemplateAreas: `
            "content side"
          `,
          gridTemplateColumns: `1fr calc(300px + ${SPACING['4XL']})`,
        }
      }}
    >{children}</div>
  )
}

export function Content({ children }) {
  return (
    <div css={{
      gridArea: 'content'
    }}>
      {children}
    </div>
  )
}

export function Side({ children }) {
  return (
    <section
      css={{
        gridArea: 'side',
        [MEDIA_QUERIES.LARGESCREEN]: {
          paddingLeft: SPACING['XL'],
          marginLeft: SPACING['2XL'],
          borderLeft: `solid 1px ${COLORS.neutral[100]}`
        }
      }}
    >{children}</section>
  )
}