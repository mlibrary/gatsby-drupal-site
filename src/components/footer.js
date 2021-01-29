import React from 'react'
import {
  COLORS,
  SPACING,
  Margins,
  Heading,
  MEDIA_QUERIES,
} from '@umich-lib/core'

import fdlp from '../images/fdlp.png'
import icons from '../maybe-design-system/icons'
import PlainLink from './plain-link'
import IconText from './icon-text'
import createGoogleMapsUrl from './utilities/create-google-maps-url'

const locationURL = createGoogleMapsUrl({
  query:
    'University of Michigan Library, 913 S. University Avenue, Ann Arbor, MI 48109',
})

// eslint-disable-next-line
const links = [
  {
    heading: 'University of Michigan Library',
    links: [
      {
        text: (
          <React.Fragment>
            913 S. University Avenue
            <br />
            Ann Arbor, MI 48109
          </React.Fragment>
        ),
        to: locationURL,
        d: icons['address'],
      },
      {
        text: '(734) 764-0400',
        to: 'tel:+1-734-764-0400',
        d: icons['phone'],
      },
      {
        text: 'Send us an email',
        to: 'https://umich.qualtrics.com/jfe/form/SV_2bpfeZMnAK2ozhr',
        icon: 'mail_outline',
      },
      {
        text: 'Accessibility',
        to:
          '/about-us/about-library/diversity-equity-inclusion-and-accessibility/accessibility',
        icon: 'accessible_forward',
      },
      {
        text: 'Site map',
        to: '/site-map',
        icon: 'map',
      },
    ],
  },
  {
    heading: 'Our community',
    links: [
      {
        text: 'Staff directory',
        to: '/about-us/staff-directory',
        icon: 'people_outline',
      },
      {
        text: 'Work for us',
        to: '/about-us/work-us',
        icon: 'work',
      },
      {
        text: 'Blogs',
        to: 'https://apps.lib.umich.edu/blogs',
        icon: 'blog',
      },
      {
        text: 'Facebook',
        to:
          'https://www.facebook.com/pages/University-of-Michigan-Library/110483979013559',
        icon: 'facebook',
      },
      {
        text: 'Twitter',
        to: 'https://twitter.com/umichlibrary',
        icon: 'twitter',
      },
      {
        text: 'YouTube',
        to: 'http://www.youtube.com/user/umlibrary/videos',
        icon: 'youtube',
      },
    ],
  },
]

function Footer() {
  const now = new Date()
  const year = now.getFullYear()

  return (
    <footer
      css={{
        background: COLORS['blue']['400'],
        '*:focus': {
          outlineColor: 'white',
        },
      }}
    >
      <Margins
        css={{
          color: 'white',
        }}
      >
        <div
          css={{
            paddingTop: SPACING['2XL'],
            paddingBottom: SPACING['L'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              paddingTop: SPACING['3XL'],
              columns: '3',
              columnGap: SPACING['XL'],
              '& section': {
                breakInside: 'avoid',
                marginBottom: '0',
              },
            },
            '& section:not(:last-of-type)': {
              marginBottom: SPACING['XL'],
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            'h2, h3': {
              color: COLORS['blue']['200'],
            },
          }}
        >
          {links.map(section => (
            <section key={section.heading}>
              <Heading level={2} size="3XS">
                {section.heading}
              </Heading>
              <ul
                css={{
                  paddingTop: SPACING['S'],
                }}
              >
                {section.links.map(({ text, to, d, icon }, y) => {
                  return (
                    <li key={y + to + text}>
                      <PlainLink
                        to={to}
                        css={{
                          display: 'inline-block',
                          padding: `${SPACING['XS']} 0`,
                        }}
                      >
                        <IconText icon={icon} d={d}>
                          {text}
                        </IconText>
                      </PlainLink>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
          <section
            css={{
              a: {
                textDecoration: 'underline',
              },
              borderTop: `solid 1px ${COLORS.blue['200']}`,
              paddingTop: SPACING['XL'],
              [MEDIA_QUERIES.LARGESCREEN]: {
                border: '0',
                padding: '0',
                borderLeft: `solid 1px ${COLORS.blue['300']}`,
                paddingLeft: SPACING['XL'],
                marginLeft: `-${SPACING['2XL']}`,
              },
            }}
          >
            <Heading
              level={2}
              size="3XS"
              css={{
                paddingBottom: SPACING['S'],
              }}
            >
              Privacy and copyright
            </Heading>
            <PlainLink to="/about-us/policies/library-privacy-statement">
              Library Privacy Statement
            </PlainLink>
            <p
              css={{
                paddingTop: SPACING['S'],
                paddingBottom: SPACING['L'],
              }}
            >
              Except where otherwise noted, this work is subject to a{' '}
              <a href="http://creativecommons.org/licenses/by/4.0/">
                Creative Commons Attribution 4.0 license
              </a>
              . For details and exceptions, see the{' '}
              <PlainLink to="/about-us/policies/copyright-policy">
                Library Copyright Policy
              </PlainLink>
              .
            </p>

            <p
              css={{
                display: 'flex',
              }}
            >
              <img
                src={fdlp}
                alt=""
                css={{ height: '2rem', marginRight: SPACING['S'] }}
              />
              <span>Federal Depository Library Program</span>
            </p>
          </section>
        </div>

        <p
          css={{
            marginBottom: SPACING['2XL'],
          }}
        >
          Have a question about this website?{' '}
          <a
            href="https://umich.qualtrics.com/jfe/form/SV_87ZJbL09VT6wZvL"
            css={{
              textDecoration: 'underline',
            }}
          >
            Contact the website team
          </a>
          .
        </p>
      </Margins>
      <div
        css={{
          background: COLORS['blue']['500'],
          padding: `${SPACING['M']} 0`,
          color: COLORS.blue['200'],
        }}
      >
        <Margins>
          <span
            css={{
              marginRight: SPACING['XL'],
              display: 'block',
              paddingBottom: SPACING['XS'],
              [MEDIA_QUERIES.LARGESCREEN]: {
                display: 'inline',
                padding: '0',
              },
            }}
          >
            © {year}, Regents of the University of Michigan
          </span>

          <span
            css={{
              marginRight: SPACING['XL'],
            }}
          >
            Built with the{' '}
            <a
              href="https://design-system.lib.umich.edu/"
              css={{ textDecoration: 'underline' }}
            >
              U-M Library Design System
            </a>
          </span>

          <span>
            <PlainLink
              css={{ textDecoration: 'underline' }}
              to="/release-notes"
            >
              Release notes
            </PlainLink>
          </span>
        </Margins>
      </div>
    </footer>
  )
}

export default Footer
