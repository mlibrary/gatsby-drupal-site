import React from 'react'

import BackgroundImage from 'gatsby-background-image'
import {
  Heading,
  SPACING,
  COLORS,
  Margins,
  MEDIA_QUERIES,
} from '@umich-lib/core'
import Link from '../link'
import HTML from '../html'
import usePageContextByDrupalNodeID from '../../hooks/use-page-context-by-drupal-node-id'

const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN,
}

function getNIDFromURI({ uri }) {
  if (uri.includes('entity:node/')) {
    return uri.split('/')[1]
  }

  return null
}

function getLinkByNID({ nids, nid }) {
  const obj = nids[nid]

  if (!obj) {
    return null
  }

  return {
    text: obj.title,
    to: obj.slug,
  }
}

export default function HeroText({ data }) {
  /*
    Consider finding a better way to do this.
  */
  const nids = usePageContextByDrupalNodeID()
  const nid = getNIDFromURI({ uri: data.field_link && data.field_link[0].uri })
  const link = getLinkByNID({ nids, nid })

  return (
    <Margins
      css={{
        padding: '0',
        [MEDIA_QUERIES.LARGESCREEN]: {
          padding: '0',
        },
        [MEDIAQUERIES['M']]: {
          padding: '0',
        },
        [MEDIAQUERIES['L']]: {
          padding: `0 ${SPACING['2XL']}`,
        },
      }}
    >
      <BackgroundSection data={data}>
        <div
          css={{
            padding: `${SPACING['2XL']} ${SPACING['M']}`,
            [MEDIA_QUERIES.LARGESCREEN]: {
              padding: `${SPACING['4XL']} ${SPACING['S']}`,
            },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            css={{
              textAlign: 'center',
              color: 'white',
              a: {
                color: 'white',
                boxShadow: 'none',
                textDecoration: 'underline',
                ':hover': {
                  boxShadow: 'none',
                  textDecorationThickness: '2px',
                },
              },
            }}
          >
            <Heading
              size="3XL"
              level={2}
              css={{
                marginBottom: SPACING['M'],
              }}
            >
              {data.field_title}
            </Heading>
            <HTML
              html={data.field_caption_text.processed}
              css={{
                display: 'inline-block',
                fontSize: '1.25rem',
                width: 'auto',
              }}
            />
            {link && (
              <div
                css={{
                  marginTop: SPACING['M'],
                  fontSize: '1.25rem',
                  a: {
                    textDecorationThickness: '2px',
                    textDecorationColor: COLORS.maize['400'],
                    ':focus, :hover': {
                      textDecorationThickness: '4px',
                    },
                  },
                }}
              >
                <Link to={link.to}>{link.text}</Link>
              </div>
            )}
          </div>
        </div>
      </BackgroundSection>
    </Margins>
  )
}

function BackgroundSection({ data, children, ...rest }) {
  const { field_hero_images } = data.relationships
  const smallScreenImage = field_hero_images.find(
    node => node.field_orientation === 'vertical'
  ).relationships.field_media_image.localFile.childImageSharp.fluid
  const largeScreenImage = field_hero_images.find(
    node => node.field_orientation === 'horizontal'
  ).relationships.field_media_image.localFile.childImageSharp.fluid
  const sources = [
    smallScreenImage,
    {
      ...largeScreenImage,
      media: `(min-width: 720px)`,
    },
  ]

  return (
    <BackgroundImage
      Tag="section"
      fluid={sources}
      backgroundColor={COLORS.neutral['100']}
      css={{
        backgroundPosition: 'center top 33%',
        [MEDIA_QUERIES.LARGESCREEN]: {
          backgroundPosition: 'center left 20%',
          backgroundSize: 'cover',
        },
      }}
      {...rest}
    >
      {children}
    </BackgroundImage>
  )
}
