import React from 'react'
import {
  Heading,
  SPACING,
  COLORS,
  Margins,
  Icon,
  MEDIA_QUERIES,
} from '@umich-lib/core'

import Card from '../card'
import Link from '../link'
import HTML from '../html'
import Address from '../address'
import Hours from '../todays-hours'
import icons from '../../maybe-design-system/icons'
import HoursPanel from './hours-panel'
import HeroPanel from './hero-panel'
import GroupPanel from './group-panel'
import HoursLitePanel from './hours-lite-panel'
import LinkPanel from './link-panel'
import DestinationHorizontalPanel from './destination-horizontal-panel'
import getParentTitle from '../../utils/get-parent-title'
import CustomPanel from './custom-panel'
import Callout from '../../maybe-design-system/callout'
import Image from '../image'

import { StateProvider } from '../use-state'

function PanelTemplate({ title, children, shaded, ...rest }) {
  return (
    <section
      data-can-be-shaded={shaded}
      data-panel
      css={{
        background: shaded ? COLORS.blue['100'] : '',
        borderBottom: shaded ? 'none' : `solid 1px ${COLORS.neutral['100']}`,
        ':last-of-type': {
          borderBottom: 'none',
        },
        paddingTop: SPACING['XL'],
        paddingBottom: SPACING['XL'],
        [MEDIA_QUERIES.LARGESCREEN]: {
          paddingTop: SPACING['3XL'],
          paddingBottom: SPACING['3XL'],
        },
      }}
      {...rest}
    >
      <Margins data-panel-margins>
        {title && (
          <Heading
            level={2}
            size="M"
            css={{
              marginBottom: SPACING['XL'],
            }}
          >
            {title}
          </Heading>
        )}
        {children}
      </Margins>
    </section>
  )
}

function PanelList({ largeScreenTwoColumn, children, twoColumns, ...rest }) {
  const panelListGridStyles = {
    [MEDIA_QUERIES.LARGESCREEN]: {
      marginBottom: SPACING['XL'],
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gridGap: `${SPACING['XL']} ${SPACING['M']}`,
    },
  }
  const panelListColumnStyles = {
    [MEDIA_QUERIES.LARGESCREEN]: {
      columns: '2',
      columnGap: SPACING['3XL'],
      '> li': {
        breakInside: 'avoid',
        marginBottom: SPACING['XL'],
      },
    },
  }

  return (
    <ol
      css={twoColumns ? panelListColumnStyles : panelListGridStyles}
      {...rest}
    >
      {children}
    </ol>
  )
}

function CardPanel({ data, headingLevel = 2 }) {
  const template = data.relationships.field_card_template.field_machine_name

  if (template === 'destination_hor_card_template') {
    return <DestinationHorizontalPanel data={data} />
  }

  const title = data.field_title
  const cards = data.relationships.field_cards
  const noImage = template === 'standard_no_image'
  const useSummary = template !== 'address_and_hours'

  function getCardSubtitle(card) {
    if (template === 'destination_card_template') {
      return getParentTitle({ node: card })
    }

    return null
  }

  function getImage(image) {
    return !image || noImage
      ? null
      : image.relationships.field_media_image.localFile.childImageSharp.fluid
  }

  function getCardHref(card) {
    if (card.field_url) {
      return card.field_url.uri
    }

    return card.fields.slug
  }

  function getSummary(body) {
    return body ? body.summary : null
  }

  function renderCardChildren(data) {
    if (template === 'address_and_hours') {
      return (
        <React.Fragment>
          <div
            css={{
              display: 'flex',
              marginTop: SPACING['XS'],
            }}
          >
            <span
              css={{
                color: COLORS.maize['500'],
                marginRight: SPACING['XS'],
              }}
            >
              <Icon d={icons['address']} />
            </span>
            <Address node={data} />
          </div>
          <div
            css={{
              display: 'flex',
              marginTop: SPACING['XS'],
            }}
          >
            <span
              css={{
                color: COLORS.maize['500'],
                marginRight: SPACING['XS'],
              }}
            >
              <Icon d={icons['clock']} />
            </span>
            <Hours node={data} />
          </div>
        </React.Fragment>
      )
    }

    return null
  }

  return (
    <PanelTemplate title={title}>
      <PanelList twoColumns={noImage}>
        {cards.map((card, i) => (
          <li
            key={i + card.title}
            css={{
              marginBottom: SPACING['XL'],
              [MEDIA_QUERIES.LARGESCREEN]: {
                margin: '0',
              },
            }}
          >
            <Card
              image={
                card.relationships
                  ? getImage(card.relationships.field_media_image)
                  : null
              }
              href={getCardHref(card)}
              subtitle={getCardSubtitle(card)}
              title={card.title}
              children={
                useSummary ? getSummary(card.body) : renderCardChildren(card)
              }
              css={{
                height: '100%',
              }}
            />
          </li>
        ))}
      </PanelList>
    </PanelTemplate>
  )
}

function MarginsWrapper({ useMargins = false, children }) {
  if (useMargins) {
    return <Margins>{children}</Margins>
  }

  return children
}

function TextPanel({ data }) {
  const title = data.field_title
  const placement = data.field_placement
  const template = data.relationships.field_text_template.field_machine_name
  const cards = data.relationships.field_text_card

  if (template === 'callout') {
    return (
      <MarginsWrapper useMargins={placement !== 'body'}>
        <Callout
          intent="warning"
          css={{
            maxWidth: placement === 'body' ? '38rem' : '100%',
          }}
        >
          <Heading
            level={2}
            size="M"
            css={{
              marginBottom: SPACING['XS'],
            }}
          >
            {title}
          </Heading>

          <HTML
            html={cards[0].field_body.processed}
            css={{
              '> *': {
                maxWidth: placement === 'body' ? '38rem' : '100%',
              },
            }}
          />
        </Callout>
      </MarginsWrapper>
    )
  }

  if (template === 'body_width_text' || template === 'text_group') {
    const hasTopBorder = data.field_border === 'yes'
    const hasMarginTop = template === 'body_width_text'
    const useMargins = placement !== 'body' && template === 'body_width_text'

    return (
      <MarginsWrapper useMargins={useMargins}>
        <div
          css={{
            marginTop: hasMarginTop ? SPACING['XL'] : 0,
          }}
        >
          {cards.map(card => (
            <section
              css={{
                paddingTop: hasTopBorder ? SPACING['XL'] : 0,
                borderTop: hasTopBorder
                  ? `solid 1px ${COLORS.neutral['100']}`
                  : 'none',
              }}
            >
              <Heading
                level={2}
                size="M"
                css={{
                  marginBottom: SPACING['L'],
                }}
              >
                {title}
              </Heading>
              <HTML html={card.field_body.processed} />
            </section>
          ))}
        </div>
      </MarginsWrapper>
    )
  }

  if (template === 'full_width_text_template') {
    const html = data.relationships.field_text_card[0].field_body.processed

    return (
      <PanelTemplate
        shaded
        css={{
          paddingTop: SPACING['3XL'],
          paddingBottom: SPACING['3XL'],
          [MEDIA_QUERIES.LARGESCREEN]: {
            paddingTop: SPACING['4XL'],
            paddingBottom: SPACING['4XL'],
          },
        }}
      >
        <div
          css={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            css={{
              textAlign: 'center',
              maxWidth: '38rem',
            }}
          >
            <Heading
              level={2}
              size="M"
              css={{
                marginBottom: SPACING['M'],
              }}
            >
              {title}
            </Heading>
            <div css={{ color: COLORS.neutral['300'] }}>
              <HTML html={html} />
            </div>
          </div>
        </div>
      </PanelTemplate>
    )
  }

  if (template === 'grid_text_template_with_linked_title') {
    return (
      <PanelTemplate title={title}>
        <PanelList twoColumns={true}>
          {cards.map(({ field_title, field_body, field_link }, i) => (
            <li
              key={i + field_title}
              css={{
                marginBottom: SPACING['XL'],
                [MEDIA_QUERIES.LARGESCREEN]: {
                  margin: '0',
                },
              }}
            >
              <div
                css={{
                  marginBottom: SPACING['XS'],
                }}
              >
                <Link to={field_link[0].uri} kind="description">
                  {field_title}
                </Link>
              </div>
              <div css={{ color: COLORS.neutral['300'] }}>
                <HTML html={field_body.processed} />
              </div>
            </li>
          ))}
        </PanelList>
      </PanelTemplate>
    )
  }

  if (template === 'image_text_body') {
    const items = cards.map(card => {
      return {
        heading: card.field_title,
        html: card.field_body.processed,
        image:
          card.relationships.field_text_image.relationships.field_media_image
            .localFile.childImageSharp.fluid,
        imageAlt:
          card.relationships.field_text_image.relationships.field_media_image
            .relationships?.media__image[0]?.field_media_image.alt,
      }
    })

    return (
      <PanelTemplate title={title}>
        {items.map(({ heading, html, image, imageAlt }, i) => (
          <section
            key={i + html}
            css={{
              display: 'flex',
              marginBottom: SPACING['L'],
              paddingBottom: SPACING['M'],
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
            }}
          >
            <div
              css={{
                width: '8rem',
                marginRight: SPACING['L'],
                flexShrink: '0',
              }}
            >
              <Image image={image} alt={imageAlt} />
            </div>
            <div>
              {heading && (
                <Heading
                  level={title ? 2 : 2} // Use heading level 3 if has (h2) panel title.
                  size="S"
                  css={{
                    marginTop: `0 !important`,
                    marginBottom: SPACING['XS'],
                  }}
                >
                  {heading}
                </Heading>
              )}

              <HTML html={html} />
            </div>
          </section>
        ))}
      </PanelTemplate>
    )
  }

  return null
}

export default function Panels({ data }) {
  if (!data) {
    return null
  }

  return (
    <PanelStateWrapper>
      <HideNotFirstHoursNextPreviousButtons>
        {data.map((panel, i) => {
          const type = panel.__typename
          const id = panel.id

          switch (type) {
            case 'paragraph__hours_panel_lite':
              return <HoursLitePanel data={panel} key={id} />
            case 'paragraph__link_panel':
              return <LinkPanel data={panel} key={id} />
            case 'paragraph__group_panel':
              return <GroupPanel data={panel} key={id} />
            case 'paragraph__card_panel':
              return <CardPanel data={panel} key={id} />
            case 'paragraph__text_panel':
              return <TextPanel data={panel} key={id} />
            case 'paragraph__hours_panel':
              return <HoursPanel data={panel} key={id} />
            case 'paragraph__hero_panel':
              return <HeroPanel data={panel} key={id} />
            case 'paragraph__custom_panel':
              return <CustomPanel data={panel} key={id} />
            default:
              console.warn('Unknown panel type', type)
              return null
          }
        })}
      </HideNotFirstHoursNextPreviousButtons>
    </PanelStateWrapper>
  )
}

function HideNotFirstHoursNextPreviousButtons({ children }) {
  return (
    <div
      css={{
        '[data-hours-panel-next-previous]': {
          display: 'none',
        },
        '> [data-hours-panel]:first-of-type': {
          '[data-hours-panel-next-previous]': {
            display: 'block',
          },
        },
      }}
    >
      {children}
    </div>
  )
}

function PanelStateWrapper({ children }) {
  const initialState = {
    weekOffset: 0,
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setWeekOffset':
        return {
          ...state,
          weekOffset: action.weekOffset,
        }
      default:
        return state
    }
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {children}
    </StateProvider>
  )
}

export { PanelTemplate, PanelList }
