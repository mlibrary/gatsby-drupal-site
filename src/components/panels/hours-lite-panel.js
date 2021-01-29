import React, { useState, useEffect } from 'react'
import { SPACING, Icon, TYPOGRAPHY, COLORS, Heading } from '@umich-lib/core'
import * as moment from 'moment'
import { Link as GatsbyLink } from 'gatsby'

import Link from '../link'
import icons from '../../maybe-design-system/icons'
import MEDIA_QUERIES from '../../maybe-design-system/media-queries.js'
import { displayHours } from '../../utils/hours'

export default function HoursLitePanel({ data }) {
  const [initialized, setInitialized] = useState(false)
  const { field_title } = data
  const hours = processHoursData(data.relationships.field_cards, initialized)

  useEffect(() => {
    setInitialized(true)
  }, [])

  return (
    <section>
      <Heading level={2} size="M">
        {field_title}
      </Heading>

      <ol
        css={{
          marginTop: SPACING['L'],
        }}
      >
        {hours.map((h, i) => (
          <li
            key={i + h.text + h.to}
            css={{
              display: 'flex',
            }}
          >
            <span
              css={{
                display: 'inline',
                color: COLORS.maize['500'],
                width: '1.5rem',
                flexShrink: '0',
              }}
            >
              <Icon d={icons['clock']} />
            </span>
            <GatsbyLink
              to={h.to}
              css={{
                flex: '1',
                ':hover span': {
                  textDecoration: 'underline',
                },
                paddingBottom: `${SPACING['S']}`,
              }}
            >
              <span>
                <span
                  data-text
                  css={{
                    display: 'block',
                    [MEDIA_QUERIES['M']]: {
                      display: 'inline-block',
                      marginRight: SPACING['XS'],
                    },
                  }}
                >
                  {h.text}
                </span>
                <span
                  css={{
                    display: 'inline-block',
                    marginTop: SPACING['3XS'],
                    [MEDIA_QUERIES['M']]: {
                      marginTop: '0',
                      display: 'inline-block',
                    },
                    ...TYPOGRAPHY['3XS'],
                    color: COLORS.neutral['300'],
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                  }}
                  aria-label={h.subLabel}
                >
                  {h.subText}
                </span>
              </span>
            </GatsbyLink>
          </li>
        ))}
        <li>
          <Link
            kind="list-strong"
            to="/locations-and-hours/hours-view"
            css={{
              marginLeft: '1.5rem',
            }}
          >
            View all hours, locations, and access details
          </Link>
        </li>
      </ol>
    </section>
  )
}

/*
const hoursDataExample = [
  {
    text: 'Hatcher Library',
    subText: 'Today: 8AM - 7PM',
    to: '/'
  },
  {
    text: 'Shapiro Library',
    subText: 'Today: Open 24 hours',
    to: '/'
  },
  {
    text: 'Art, Architecture & Engineering Library',
    subText: 'Today: 7AM - 11PM',
    to: '/'
  },
  {
    text: 'Taubman Health Sciences Library',
    subText: 'Today: 6AM - 11PM',
    to: '/'
  }
]
*/

function processHoursData(data, initialized) {
  function hours(node) {
    if (initialized) {
      const now = moment()
      return displayHours({ node, now })
    }

    return { text: '...', label: 'Loading hours... ' }
  }

  const result = data.map(node => {
    const hoursData = hours(node)
    const { text, label } = hoursData
      ? hoursData
      : {
          text: 'n/a',
          label: 'n/a',
        }

    return {
      text: node.title,
      subText: 'TODAY: ' + text,
      subLabel: 'TODAY: ' + label,
      to: node.fields.slug,
    }
  })

  return result
}
