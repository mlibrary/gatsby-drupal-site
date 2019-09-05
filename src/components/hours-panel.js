import React, { useState, useEffect } from 'react'
import { Margins, Heading, SPACING } from '@umich-lib/core'
import * as moment from 'moment'

import { displayHours } from '../utils/hours'
import HoursTable from './hours-table'

export default function HoursPanelContainer({ data }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setInitialized(true)
  }, [initialized])

  if (!initialized) {
    return null
  }

  const { relationships } = data
  const { title } = relationships.field_parent_card[0]

  const now = moment() // next / prev week container UI will control this ...
  const tableData = transformTableData(data, now)

  return (
    <Margins>
      <HoursPanel title={title} tableData={tableData} />
    </Margins>
  )
}

function HoursPanel({ title, tableData = {} }) {
  return (
    <section
      css={{
        marginTop: SPACING['L'],
        marginBottom: SPACING['4XL'],
      }}
    >
      <Heading
        level={2}
        size="L"
        css={{
          fontWeight: '700',
          marginBottom: SPACING['2XL'],
        }}
      >
        {title}
      </Heading>
      <HoursTable data={tableData} />
    </section>
  )
}

function transformTableData(node, now) {
  const { field_cards, field_parent_card } = node.relationships

  /*
    [
      {
        text: 'Sun',
        subtext: 'Apr 15'
      },
      ...
      {
        text: 'Sat',
        subtext: 'Apr 21'
      },
    ]
  */
  let headings = []

  for (let i = 0; i < 7; i++) {
    headings = headings.concat({
      text: now.day(i).format('ddd'),
      subtext: now.day(i).format('MMM D'),
    })
  }

  /*
    Make the rows.
      1. title (th[scope="row"])
      2-n. The hours.

    [
      [
        'General',
        '24 hours',
        ...
      ]
    ]
  */
  const rows = [
    getRow(field_parent_card[0], true),
    ...field_cards.map(n => getRow(n)),
  ]

  return {
    headings,
    rows,
  }

  const dummyData = {
    headings: [
      {
        text: 'Sun',
        subtext: 'Apr 15',
      },
      {
        text: 'Mon',
        subtext: 'Apr 16',
      },
      {
        text: 'Tue',
        subtext: 'Apr 17',
      },
      {
        text: 'Wed',
        subtext: 'Apr 18',
      },
      {
        text: 'Thu',
        subtext: 'Apr 19',
      },
      {
        text: 'Fri',
        subtext: 'Apr 20',
      },
      {
        text: 'Sat',
        subtext: 'Apr 21',
      },
    ],
    rows: [
      [
        'General',
        '24 hours',
        '24 hours',
        '24 hours',
        '24 hours',
        '24 hours',
        '24 hours',
        '24 hours',
      ],
      [
        'Computer and Video Game Archive',
        'Closed',
        '10am - 8pm',
        '10am - 8pm',
        '10am - 8pm',
        '10am - 8pm',
        '10am - 8pm',
        'Closed',
      ],
    ],
  }

  return dummyData
}

/*
  Return

  [
    'General',
    '24 hours',
    '10am - 5pm'
  ]
*/
function getRow(node, isParent) {
  let hours = []

  for (let i = 0; i < 7; i++) {
    const now = moment().day(i)
    const display = displayHours({
      node,
      now,
    })

    hours = hours.concat(display ? display : 'n/a')
  }

  return [isParent ? 'General' : node.title].concat(hours)
}