import { useStaticQuery, graphql } from 'gatsby'
import React, { useState, useEffect } from 'react'
import { SPACING, MEDIA_QUERIES, Heading, Margins } from '@umich-lib/core'
import Link from '../link'
import EventCard from '../event-card'
import { sortEventsByStartDate } from '../../utils/events'

/*
  Featured and latest news and exhibits.
  
  "What's happening?"

  look at all kinds of events that are prioritized,
  use those, then if we need more add in some
  non prioritized events (except don't use Exhibits).
  Make sure we use up to 3, but no more.
  Sort all of them by date.
*/
export default function WhatsHappening() {
  const [events, setEvents] = useState(null)

  const data = useStaticQuery(graphql`
    query {
      priorityEvents: allNodeEventsAndExhibits(
        filter: {
          field_priority_for_homepage: { eq: true }
          relationships: {
            field_design_template: {
              field_machine_name: { eq: "event_exhibit" }
            }
          }
        }
      ) {
        nodes {
          ...eventFragment
        }
      }
      otherEvents: allNodeEventsAndExhibits(
        filter: {
          field_priority_for_homepage: { eq: false }
          relationships: {
            field_design_template: {
              field_machine_name: { eq: "event_exhibit" }
            }
            field_event_type: { name: { ne: "Exhibit" } }
          }
        }
      ) {
        nodes {
          ...eventFragment
        }
      }
    }
  `)

  useEffect(() => {
    if (events === null) {
      // Join exhibits with events, but only keep 3.
      const joinedEvents = sortEventsByStartDate({
        events: data.priorityEvents.nodes,
        onlyTodayOrAfter: true,
      }).concat(
        sortEventsByStartDate({
          events: data.otherEvents.nodes,
          onlyTodayOrAfter: true,
        })
      )

      const sortedEvents = sortEventsByStartDate({
        events: joinedEvents,
      })

      setEvents(sortedEvents.slice(0, 3)) // only keep 3
    }
  }, [events]) // eslint-disable-line

  // Make sure there are events to render.
  if (!events || events.length === 0) {
    return null
  }

  return (
    <div
      css={{
        marginTop: SPACING['3XL'],
        marginBottom: SPACING['3XL'],
      }}
    >
      <Margins>
        <Heading level={2} size="L">
          What's happening?
        </Heading>

        <div
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gridGap: `${SPACING['XL']} ${SPACING['M']}`,
            },
          }}
        >
          {events.map(event => (
            <EventCard {...event} displayImage={false} hasBorder={false} />
          ))}
        </div>

        <Link to="/visit-and-study/events-and-exhibits/today-and-upcoming">
          View all events
        </Link>
      </Margins>
    </div>
  )
}
