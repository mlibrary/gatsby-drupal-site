import React, { useState, useEffect } from 'react'
import * as moment from 'moment'

import { displayHours } from '../utils/hours'

export default function Hours({ node }) {
  const [initialized, setInitialized] = useState(false)

  /*
    We don't want to SSR hours since that
    is dynamic to now.
  */
  useEffect(() => {
    setInitialized(true)
  }, [initialized])

  if (!initialized) {
    return <React.Fragment>…</React.Fragment>
  }

  const now = moment()
  const hours = displayHours({ node, now })

  if (!hours) {
    return 'Today: n/a'
  }

  return <span aria-label={hours.label}>Today: {hours.text}</span>
}
