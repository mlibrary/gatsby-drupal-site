import React from 'react'

import BackgroundImage from 'gatsby-background-image'
import {
  Heading,
  SPACING,
  COLORS,
  Margins,
  MEDIA_QUERIES,
} from '@umich-lib/core'
import HTML from '../html'

const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN,
}

export default function HeroText({ data }) {
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
      <section
        css={{
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
                  fontSize: '1.25rem',
                }}
              />
            </div>
          </div>
        </BackgroundSection>
      </section>
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
