import React, { useEffect, useState } from 'react'
import { Margins, COLORS, SPACING, Icon } from '@umich-lib/core'
import Alert from '@reach/alert'

export default function LibraryAlerts({ domain }) {
  const [alerts, setAlerts] = useState(null)

  async function fetchAlerts() {
    const response = await fetch('https://staff.lib.umich.edu/api/alerts')

    if (response.status === 200) {
      const result = await response.json()
      const filtered = result.reduce((memo, alert) => {
        const domains = alert.domains.split(', ')

        if (domains.includes(domain)) {
          memo = memo.concat(alert)
        }

        return memo
      }, [])

      setAlerts(filtered)
    }
  }

  useEffect(() => {
    fetchAlerts()
  })

  if (!alerts) {
    return null
  }

  return (
    <React.Fragment>
      {alerts.map((alert, i) => (
        <div
          css={{
            background: COLORS.orange['300'],
            padding: `${SPACING['XS']} 0`,
            a: {
              textDecoration: 'underline',
            },
          }}
        >
          <Margins>
            <div
              css={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gridGap: SPACING['S'],
                br: {
                  display: 'none',
                },
                'strong, b': {
                  fontWeight: '800',
                },
              }}
            >
              <Icon icon="warning" css={{ marginTop: '6px' }} />{' '}
              <Alert
                css={{
                  '* + *': {
                    marginTop: SPACING['S'],
                  },
                }}
                dangerouslySetInnerHTML={{ __html: alert.description }}
              />
            </div>
          </Margins>
        </div>
      ))}
    </React.Fragment>
  )
}
