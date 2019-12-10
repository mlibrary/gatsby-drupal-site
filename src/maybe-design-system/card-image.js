import React from 'react'
import BackgroundImage from 'gatsby-background-image'
import { COLORS, SPACING } from '@umich-lib/core'

export default function CardImage({ image }) {
  console.log('image', image)

  return (
    <BackgroundImage
      aria-hidden="true"
      data-card-image
      tag="div"
      fluid={image}
      css={{
        backgroundColor: COLORS.blue['100'],
        paddingTop: '66.67%',
        marginBottom: SPACING['S'],
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    />
  )
}
