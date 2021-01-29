import React from 'react'
import {
  EXHIBIT_TYPES,
  eventFormatWhen,
  eventFormatWhere,
} from '../utils/events'
import { Heading, SPACING, COLORS, TYPOGRAPHY, Icon } from '@umich-lib/core'
import CardImage from '../maybe-design-system/card-image'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import icons from '../maybe-design-system/icons'
import Link from './link'

export default function EventCard(node) {
  const {
    displayImage = true,
    title,
    relationships,
    body,
    fields,
    field_event_date_s_,
    hasBorder = true,
  } = node
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const start = field_event_date_s_[0].value
  const end = field_event_date_s_[0].end_value
  const type = relationships.field_event_type.name
  const isAnExhibit = EXHIBIT_TYPES.includes(type)
  const useBorder = hasBorder
  const when = eventFormatWhen({
    start,
    end,
    kind: 'brief',
    type,
  })
  const where = eventFormatWhere({
    node,
    kind: 'brief',
  })
  const to = fields.slug

  return (
    <section
      css={{
        paddingBottom: SPACING['L'],
        marginTop: SPACING['L'],
        [MEDIA_QUERIES['L']]: {
          display: displayImage ? 'grid' : 'block',
          gridTemplateColumns: `16rem 1fr `,
          gridGap: SPACING['M'],
        },
        borderBottom: useBorder ? `solid 1px ${COLORS.neutral['100']}` : '',
      }}
    >
      {displayImage && <CardImage image={imageData} />}
      <div>
        <Heading
          size="S"
          level={2}
          css={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: SPACING['2XS'],
          }}
        >
          <span css={{ order: 1 }}>
            <Link to={to} kind="description">
              {title}
            </Link>
          </span>
          <span
            css={{
              marginTop: SPACING['3XS'],
              display: 'block',
              color: COLORS.neutral['300'],
              order: 0,
              ...TYPOGRAPHY['3XS'],
            }}
          >
            {when}
          </span>
        </Heading>
        <p
          css={{
            marginTop: SPACING['2XS'],
            color: COLORS.neutral['300'],
          }}
        >
          {body.summary}
        </p>

        <p
          css={{
            marginTop: SPACING['2XS'],
          }}
        >
          <span
            css={{
              color: COLORS.neutral['300'],
              marginRight: SPACING['L'],
            }}
          >
            <Icon d={icons['address']} />
            <span
              css={{
                marginLeft: SPACING['XS'],
              }}
            >
              <span className="visually-hidden">Where: </span>
              {where}
            </span>
          </span>
          {!isAnExhibit && (
            <span
              css={{
                color: COLORS.neutral['300'],
              }}
            >
              <Icon d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
              <span
                css={{
                  marginLeft: SPACING['XS'],
                }}
              >
                <span className="visually-hidden">Event type: </span>
                {type}
              </span>
            </span>
          )}
        </p>
      </div>
    </section>
  )
}
