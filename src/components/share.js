import React from 'react'
import { Heading, SPACING, COLORS } from '@umich-lib/core'
import PlainLink from './plain-link'
import IconText from './icon-text'

const qs = require('qs')

export default function Share({ url, title }) {
  const emailProps = qs.stringify({
    subject: title,
    body: `University of Michigan Library: ${url}`,
  })

  const twitterProps = qs.stringify({
    url,
    text: `${title} @UMichLibrary`,
  })

  const fbProps = qs.stringify({
    u: url,
    t: title,
  })

  const options = [
    {
      text: 'Facebook',
      to: `http://www.facebook.com/sharer/sharer.php?${fbProps}`,
      icon: 'facebook',
    },
    {
      text: 'Twitter',
      to: `https://twitter.com/share?${twitterProps}`,
      icon: 'twitter',
    },
    {
      text: 'Email',
      to: `mailto:?${emailProps}`,
      icon: 'email',
    },
  ]

  return (
    <React.Fragment>
      <Heading
        level={2}
        size="2XS"
        css={{
          fontWeight: '600',
        }}
      >
        Share
      </Heading>
      <ul>
        {options.map(({ text, to, icon, d }, y) => {
          return (
            <li key={y + to + text}>
              <PlainLink
                to={to}
                css={{
                  display: 'inline-block',
                  padding: `${SPACING['XS']} 0`,
                  svg: {
                    color: COLORS.neutral['300'],
                  },
                  ':hover': {
                    textDecoration: 'underline',
                  },
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
    </React.Fragment>
  )
}
