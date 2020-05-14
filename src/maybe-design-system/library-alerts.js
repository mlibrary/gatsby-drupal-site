import React, { useEffect, useState } from 'react'
import { Margins, COLORS, SPACING, Icon } from '@umich-lib/core'
import Alert from '@reach/alert'

export default function LibraryAlerts({ domain }) {
  const [status, setStatus] = useState('loading')
  const [alerts, setAlerts] = useState(null)

  useEffect(() => {
    async function fetchAlerts() {
      try {
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
          setStatus('success')
        }
      } catch (error) {
        console.warn('Unable to fetch U-M Library Website Alerts.', error)
        setStatus('error')
      }
    }

    if (status === 'loading') {
      fetchAlerts()
    }
  }, [status, domain])

  if (status === 'success') {
    return (
      <React.Fragment>
        {alerts.map((alert, i) => (
          <div
            key={alert.uuid}
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
                  dangerouslySetInnerHTML={{ __html: alert.html }}
                />
              </div>
            </Margins>
          </div>
        ))}
      </React.Fragment>
    )
  }

  return null
}
