import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { COLORS, SPACING } from '@umich-lib/core'
import HoursTableSmallscreens from './hours-table-smallscreens'

export default function HoursTableContainer(props) {
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 1100px)',
  })

  if (isLargeScreen) {
    return <HoursTable {...props} />
  }

  return <HoursTableSmallscreens {...props} />
}

function HoursTable({ data, headingId, dayOfWeek = false }) {
  const todayIndex = dayOfWeek !== false ? dayOfWeek + 1 : -1

  return (
    <div role="group" aria-labelledby={headingId}>
      <table
        css={{
          width: '100%',
          minWidth: '60rem',
          marginTop: SPACING['XL'],
          textAlign: 'left',
          tableLayout: 'fixed',
          'th, td': {
            padding: '0.75rem',
            borderBottom: 'solid 1px #E5E9ED',
          },
          'tbody tr:first-of-type': {
            borderTop: 'solid 2px #E5E9ED',
            background: '#F7F8F9',
          },
          'tbody th': {
            fontWeight: '700',
          },
          [`th:nth-of-type(${todayIndex +
            1}), td:nth-of-type(${todayIndex})`]: {
            borderRight: 'solid 2px #FFCB05',
            borderLeft: 'solid 2px #FFCB05',
          },
          [`thead th:nth-of-type(${todayIndex + 1})`]: {
            borderTop: 'solid 2px #FFCB05',
          },
          [`tbody > tr:last-child td:nth-of-type(${todayIndex})`]: {
            borderBottom: 'solid 2px #FFCB05',
          },
        }}
      >
        <thead>
          <tr>
            <th colSpan="2" scope="col">
              <span className="visually-hidden">Day</span>
            </th>
            {data.headings.map(({ text, subtext, label }, i) => (
              <th
                scope="col"
                aria-current={i === todayIndex}
                key={text + subtext + i}
                aria-label={label}
              >
                <div
                  css={{
                    position: 'relative',
                  }}
                >
                  {i + 1 === todayIndex && (
                    <span
                      css={{
                        position: 'absolute',
                        marginLeft: `calc(-0.75rem + -2px)`,
                        marginTop: `calc(-2rem + -2px)`,
                        display: `inline-block`,
                        padding: `0 ${SPACING['2XS']}`,
                        background: '#FFCB05',
                        borderRadius: '2px 2px 0 0',
                        fontWeight: '700',
                        fontSize: '0.875rem',
                      }}
                      aria-hidden="true"
                    >
                      TODAY
                    </span>
                  )}
                  <span
                    css={{
                      display: 'block',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                    }}
                  >
                    {text}
                  </span>
                  <span css={{ color: COLORS.neutral['300'] }}>{subtext}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, y) => (
            <tr key={row + y}>
              {row.map((col, i) => (
                <React.Fragment key={row + col.label + y + i}>
                  {i === 0 ? (
                    <th scope="row" colSpan="2" aria-label={col.label}>
                      {col.text}
                    </th>
                  ) : (
                    <td aria-label={col.label}>{col.text}</td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
