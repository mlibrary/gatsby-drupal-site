import React from 'react'

import Alert from '@reach/alert'
import { SPACING, COLORS, Heading, Icon } from '@umich-lib/core'

export default function Callout({ title, children, intent, alert, ...rest }) {
  return (
    <div
      css={{
        margin: `${SPACING['XL']} 0`,
        padding: SPACING['L'],
        border: `solid 1px ${COLORS.neutral['100']}`,
        borderLeft: `solid 4px ${
          intent === 'warning' ? COLORS.maize['400'] : COLORS.teal['400']
        }`,
        borderRadius: '4px',
      }}
      {...rest}
      data-umich-lib-callout
    >
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gridGap: SPACING['S'],
        }}
      >
        {intent === 'warning' && (
          <Icon
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            size={24}
            css={{
              marginTop: SPACING['2XS'],
              color: COLORS.maize['500'],
            }}
          />
        )}
        <div>
          {alert ? (
            <Alert>
              {title && <Heading size="M">{title}</Heading>}
              {children}
            </Alert>
          ) : (
            <React.Fragment>
              {title && <Heading size="M">{title}</Heading>}
              {children}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}
