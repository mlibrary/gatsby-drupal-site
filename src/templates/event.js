import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import * as moment from 'moment'
import { Margins, Heading, SPACING, COLORS, TYPOGRAPHY } from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import Link from '../components/link'
import Share from '../components/share'

/*
  TODO:
  - [ ] Add events to build as a template.
  - [ ] Figure out how to reuse the share stuff with the news template.
  - [ ] Figure out Add to calendar button.
  - [ ] Figure out contact... that's probably somewhere else also.
  - [ ] Add event statement.
  - [ ] There is that date, directions, and type thing at the top.
*/

import { eventFormatWhen, eventFormatWhere } from '../utils/events'

export default function EventTemplate({ data }) {
  const node = data.event
  const { field_title_context, body, fields, relationships } = node
  const { slug } = fields
  const image =
    relationships?.field_media_image?.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const imageCaptionHTML =
    relationships?.field_media_image?.field_image_caption?.processed
  const contact = relationships?.field_library_contact
  const eventContacts = relationships?.field_non_library_event_contact

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
      </Margins>
      <Template asideWidth={'25rem'}>
        <TemplateContent>
          <Heading
            level={1}
            size="3XL"
            css={{
              marginTop: SPACING['S'],
              marginBottom: SPACING['XL'],
            }}
          >
            {field_title_context}
          </Heading>
          <EventMetadata data={node} />
          {body && <HTML html={body.processed} />}
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none',
            },
          }}
        >
          {imageData && (
            <figure
              css={{
                maxWidth: '38rem',
                marginBottom: SPACING['XL'],
              }}
            >
              <Img
                css={{
                  width: '100%',
                  borderRadius: '2px',
                }}
                fluid={imageData}
              />
              {imageCaptionHTML && (
                <figcaption
                  css={{
                    paddingTop: SPACING['S'],
                    color: COLORS.neutral['300'],
                  }}
                >
                  <HTML html={imageCaptionHTML} />
                </figcaption>
              )}
            </figure>
          )}

          <Share
            url={'https://www.lib.umich.edu' + slug}
            title={field_title_context}
          />

          {contact && (
            <React.Fragment>
              <h2
                css={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginBottom: SPACING['2XS'],
                  borderTop: `solid 1px ${COLORS.neutral['100']}`,
                  marginTop: SPACING['L'],
                  paddingTop: SPACING['L'],
                }}
              >
                Library contact
              </h2>
              <p>
                <Link to={'/users/' + contact.name}>
                  {contact.field_user_display_name}
                </Link>
                {' · '}
                <a
                  href={`mailto:${contact.field_user_email}`}
                  css={{
                    textDecoration: 'underline',
                  }}
                >
                  {contact.field_user_email}
                </a>
              </p>
            </React.Fragment>
          )}

          {eventContacts && eventContacts.length > 0 && (
            <React.Fragment>
              <h2
                css={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginBottom: SPACING['2XS'],
                  paddingTop: SPACING['L'],
                }}
              >
                Event contact
              </h2>
              {eventContacts.map(eventContact => (
                <p>
                  {`${eventContact.field_first_name} ${eventContact.field_last_name}`}
                  {' · '}
                  <a
                    href={`mailto:${eventContact.field_email}`}
                    css={{
                      textDecoration: 'underline',
                    }}
                  >
                    {eventContact.field_email}
                  </a>
                </p>
              ))}
            </React.Fragment>
          )}

          <p
            css={{
              borderTop: `solid 1px ${COLORS.neutral['100']}`,
              marginTop: SPACING['L'],
              paddingTop: SPACING['L'],
            }}
          >
            Library events are free and open to the public, and we are committed
            to making them accessible to attendees. If you anticipate needing
            accommodations to participate, please notify the listed contact with
            as much notice as possible.
          </p>
        </TemplateSide>
      </Template>
    </TemplateLayout>
  )
}

/*
  Details the events:
  - Dates and times
  - Location and directions
  - Registration link
  - Event type.
*/
function EventMetadata({ data }) {
  const dates = data.field_event_date_s_
  const eventType = data.relationships.field_event_type.name
  const registrationLink =
    data.field_registration_link && data.field_registration_link.uri
      ? {
          label: 'Register to attend',
          to: data.field_registration_link.uri,
        }
      : null
  const onlineLink = data.field_online_event_link
    ? {
        to: data.field_online_event_link.uri,
        label: data.field_online_event_link.title,
      }
    : null
  const series = data.relationships.field_event_series?.name
  const when = dates.map(date => {
    const start = moment(date.value)
    const end = moment(date.end_value)

    return eventFormatWhen({
      start,
      end,
      kind: 'full',
      type: eventType,
    })
  })

  const where = eventFormatWhere({
    node: data,
    kind: 'full',
  })

  return (
    <table
      css={{
        textAlign: 'left',
        marginBottom: SPACING['XL'],
        th: {
          width: '20%',
          paddingTop: SPACING['S'],
          paddingRight: SPACING['M'],
          fontWeight: '600',
          ...TYPOGRAPHY['3XS'],
        },
        'tr:first-of-type > th': {
          paddingTop: '0',
        },
        width: '100%',
        maxWidth: '38rem',
        'th, td': {
          padding: SPACING['M'],
          paddingLeft: '0',
          borderBottom: `solid 1px ${COLORS.neutral[100]}`,
        },
      }}
    >
      <caption class="visually-hidden">Event details</caption>
      <tr>
        <th scope="row">When</th>
        <td
          css={{
            'p + p': {
              marginTop: SPACING['XS'],
            },
          }}
        >
          {when.map(str => (
            <p>{str}</p>
          ))}
        </td>
      </tr>
      {where && (
        <tr>
          <th scope="row">Where</th>
          <td
            css={{
              'p + p': {
                marginTop: SPACING['XS'],
              },
            }}
          >
            <p>{where}</p>
            {onlineLink && (
              <p>
                <Link to={onlineLink.to}>{onlineLink.label}</Link>
              </p>
            )}
          </td>
        </tr>
      )}
      {registrationLink && (
        <tr>
          <th scope="row">Registration</th>
          <td>
            <Link to={registrationLink.to}>{registrationLink.label}</Link>
          </td>
        </tr>
      )}
      <tr>
        <th scope="row">Event type</th>
        <td>{eventType}</td>
      </tr>

      {series && (
        <tr>
          <th scope="row">Series</th>
          <td>{series}</td>
        </tr>
      )}
    </table>
  )
}

export const query = graphql`
  query($slug: String!) {
    event: nodeEventsAndExhibits(fields: { slug: { eq: $slug } }) {
      ...eventFragment
    }
  }
`
