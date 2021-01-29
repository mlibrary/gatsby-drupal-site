import React from 'react'
import FeaturedAndLatestNewsPanel from './featured-and-latest-news'
import EventsAndExhibitsPanel from './events-and-exhibits-panel'
import WhatsHappening from './whats-happening-panel'

export default function CustomPanel({ data }) {
  const name = data.field_machine_name

  if (name === 'featured_and_latest_news') {
    return <FeaturedAndLatestNewsPanel data={data} />
  } else if (name === 'ee_featured') {
    return <WhatsHappening />
  } else if (name === 'ee_landing') {
    return <EventsAndExhibitsPanel />
  }

  console.warn('Unable to find a panel matching machine name: ', name)

  return null
}
