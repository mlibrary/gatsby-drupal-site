import React from 'react'
import { Heading, SPACING, TYPOGRAPHY, COLORS } from '@umich-lib/core'
import { getFloor, getParentTitle, getImage, getRoom } from '../../utils'
import HTML from '../html'
import CardImage from '../../maybe-design-system/card-image'
import MEDIA_QUERIES from '../../maybe-design-system/media-queries'
import Link from '../link'
import useFloorPlan from '../../hooks/use-floor-plan'

export default function DestinationHorizontalPanel({ data }) {
  const cards = data.relationships.field_cards.map(card => {
    const parentTitle = getParentTitle({ node: card })
    const floor = getFloor({ node: card })
    const imageData = getImage({ node: card })
    const room = getRoom({ node: card })

    return {
      title: card.title,
      subtitle: `${parentTitle}, ${floor}, ${room}`,
      image: imageData.localFile.childImageSharp,
      content: <HTML html={card.body.processed} />,
      bid: card.relationships.field_room_building.id,
      rid: card.relationships.field_floor.id,
      linkDestText: `${parentTitle} ${floor}`,
    }
  })

  return (
    <div
      css={{
        marginTop: SPACING['XL'],
      }}
    >
      {cards.map((card, i) => (
        <DestinationCard key={i} card={card} />
      ))}
    </div>
  )
}

function DestinationCard({ card }) {
  const floorPlan = useFloorPlan(card.bid, card.rid)
  const floorPlanLinkText = `View the floor plan for ${card.linkDestText}`

  return (
    <section
      css={{
        marginBottom: SPACING['XL'],
        [MEDIA_QUERIES['L']]: {
          display: 'grid',
          gridTemplateColumns: `18.75rem 1fr `,
          gridGap: SPACING['M'],
        },
      }}
    >
      <CardImage image={card.image.fluid} />
      <div>
        <Heading
          size="S"
          level={2}
          css={{
            marginBottom: SPACING['2XS'],
          }}
        >
          {card.title}
          <span
            css={{
              marginTop: SPACING['3XS'],
              display: 'block',
              color: COLORS.neutral['300'],
              ...TYPOGRAPHY['3XS'],
            }}
          >
            {card.subtitle}
          </span>
        </Heading>
        {card.content}
        <p
          css={{
            marginTop: SPACING['M'],
          }}
        >
          <Link to={floorPlan.fields.slug}>{floorPlanLinkText}</Link>
        </p>
      </div>
    </section>
  )
}
