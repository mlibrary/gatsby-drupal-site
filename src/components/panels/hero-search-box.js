import React from 'react'
import BackgroundImage from 'gatsby-background-image'
import VisuallyHidden from '@reach/visually-hidden'
import {
  SPACING,
  Margins,
  Button,
  Icon,
  Input,
  MEDIA_QUERIES,
  TYPOGRAPHY,
  COLORS,
} from '@umich-lib/core'
import HTML from '../html'

const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN,
}

const heroHeightCSS = {
  minHeight: '16rem',
  [MEDIAQUERIES['L']]: {
    minHeight: '25rem',
  },
}

const frostCSS = {
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(2px)',
}

/*
  We have two types of heros.

  1. One that puts provides access to Library Search, "lib_search_box"
  2. A heading and HTML content on an image, "text"
*/
export default function HeroSearchBox({ data }) {
  const hasFrost = data.field_background === 'white'
  const applyFrostCSS = hasFrost ? frostCSS : {}

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
        'a, span': {
          borderColor: 'white',
          boxShadow: 'none',
        },
        a: {
          textDecoration: 'underline',
          color: COLORS.neutral['400'],
          ':hover': {
            textDecorationThickness: '2px',
          },
        },
      }}
    >
      <BackgroundSection
        data={data}
        css={{
          ...heroHeightCSS,
        }}
      >
        <div
          css={{
            ...heroHeightCSS,
            [MEDIAQUERIES['M']]: {
              ...heroHeightCSS[MEDIAQUERIES['M']],
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <div
            css={{
              maxWidth: '28rem',
              margin: '0 auto',
              padding: SPACING['M'],
              [MEDIA_QUERIES.LARGESCREEN]: {
                padding: SPACING['L'],
              },
              [MEDIAQUERIES['M']]: {
                width: '34rem',
                maxWidth: '100%',
                margin: 0,
                padding: SPACING['XL'],
                borderRadius: '2px',
                marginLeft: SPACING['2XL'],
              },
              ...applyFrostCSS,
            }}
          >
            <h1
              id="help-find"
              css={{
                margin: '0 auto',
                marginBottom: SPACING['XS'],
                ...TYPOGRAPHY['M'],
                fontWeight: '700',
                textAlign: 'center',
                [MEDIAQUERIES['M']]: {
                  maxWidth: '100%',
                  padding: '0',
                  ...TYPOGRAPHY['XL'],
                  textAlign: 'left',
                },
                [MEDIAQUERIES['L']]: {
                  fontSize: '2.25rem',
                },
              }}
            >
              What can we help you find?
            </h1>
            <Search labelId={'help-find'} />
          </div>
        </div>
        <Caption data={data} />
      </BackgroundSection>
    </Margins>
  )
}

/**
 * The background image to the hero is decorative, as it is
 * a background CSS style.
 *
 * But! We want to provide as much of an equitable experience
 * for everyone, so with a11y in mind, we will render
 * a visually hidden image in a figure with the
 * figcaption that is displayed. This will provide context
 * to the caption link that is not available from
 * the background image.
 */
function Caption({ data }) {
  const caption = data.field_caption_text && data.field_caption_text.processed
  const altText = data.relationships.field_hero_images[0].field_media_image.alt

  if (!caption) {
    return null
  }

  return (
    <div
      css={{
        position: 'absolute',
        right: '0',
        bottom: '0',
        padding: `${SPACING['2XS']} ${SPACING['S']}`,
        borderRadius: '2px 0 0 0',
        ...frostCSS,
      }}
    >
      <figure aria-hidden={altText ? 'false' : 'true'}>
        {altText && (
          <VisuallyHidden>
            <img alt={altText} />
          </VisuallyHidden>
        )}
        {caption && (
          <figcaption>
            <HTML html={caption} />
          </figcaption>
        )}
      </figure>
    </div>
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
        [MEDIAQUERIES['M']]: {
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

function Search({ labelId }) {
  return (
    <form
      action="https://search.lib.umich.edu/everything"
      method="get"
      css={{
        textAlign: 'center',
        [MEDIAQUERIES['M']]: {
          textAlign: 'left',
        },
      }}
      role="search"
      aria-labelledby={labelId}
    >
      <label
        htmlFor="library-search-query"
        css={{
          display: 'block',
          paddingBottom: SPACING['XS'],
        }}
      >
        Search our{' '}
        <a href="https://search.lib.umich.edu/catalog?utm_source=lib-home">
          catalog
        </a>
        ,{' '}
        <a href="https://search.lib.umich.edu/articles?utm_source=lib-home">
          articles
        </a>
        , and more
      </label>
      <div
        css={{
          display: 'flex',
          alignItems: 'flex-end',
          input: {
            height: '40px',
          },
        }}
      >
        <Input id="library-search-query" type="search" name="query" />
        <input type="hidden" name="utm_source" value="lib-home" />
        <Button
          type="submit"
          kind="primary"
          css={{
            marginLeft: SPACING['XS'],
          }}
        >
          <Icon icon="search" size={20} />
          <VisuallyHidden>Submit</VisuallyHidden>
        </Button>
      </div>
    </form>
  )
}
