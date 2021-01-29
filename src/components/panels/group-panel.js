import React from 'react'
import { SPACING, Margins, MEDIA_QUERIES, COLORS } from '@umich-lib/core'

import Panels from './index'

const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN,
}

export default function GroupPanel({ data }) {
  const { field_panel_group_layout, relationships } = data

  if (field_panel_group_layout === '50') {
    const { field_panel_group } = relationships

    return (
      <PanelGroup50Container>
        <Panels data={field_panel_group} />
      </PanelGroup50Container>
    )
  }

  return null
}

function PanelGroup50Container({ children }) {
  return (
    <Margins>
      <div
        css={{
          '> div': {
            marginTop: SPACING['XL'],
            [MEDIAQUERIES['L']]: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridGap: SPACING['3XL'],
              marginTop: SPACING['3XL'],
            },
            '> *': {
              marginBottom: SPACING['XL'],
              paddingBottom: SPACING['XL'],
              [MEDIAQUERIES['L']]: {
                marginBottom: SPACING['2XL'],
                paddingBottom: SPACING['2XL'],
              },
            },
            '> *:not(:last-child)': {
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
              [MEDIAQUERIES['L']]: {
                border: 'none',
                paddingRight: SPACING['3XL'],
                borderRight: `solid 1px ${COLORS.neutral[100]}`,
              },
            },
          },
        }}
      >
        {children}
      </div>
    </Margins>
  )
}
