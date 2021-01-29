import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import * as moment from 'moment'
import {
  Margins,
  Heading,
  SPACING,
  COLORS,
  Text,
  TYPOGRAPHY,
} from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import Panels from '../components/panels'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import getNode from '../utils/get-node'
import transformNodePanels from '../utils/transform-node-panels'
import Link from '../components/link'
import Share from '../components/share'

export default function NewsTemplate({ data }) {
  const node = getNode(data)
  const { bodyPanels, fullPanels } = transformNodePanels({ node })
  const { field_title_context, body, fields, relationships, created } = node
  const { slug } = fields

  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const imageCaption =
    relationships.field_media_image &&
    relationships.field_media_image.field_image_caption
      ? relationships.field_media_image.field_image_caption.processed
      : null

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
            {created && (
              <p
                css={{
                  ...TYPOGRAPHY['2XS'],
                  color: COLORS.neutral['300'],
                  fontFamily: 'Muli',
                  paddingTop: SPACING['M'],
                }}
              >
                {moment(created).format('MMMM D, YYYY')}
              </p>
            )}
          </Heading>
          {body && <HTML html={body.processed} />}
          {bodyPanels && <Panels data={bodyPanels} />}
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
              {imageCaption && (
                <figcaption
                  css={{
                    paddingTop: SPACING['S'],
                    color: COLORS.neutral['300'],
                  }}
                >
                  <HTML
                    html={
                      relationships.field_media_image.field_image_caption
                        .processed
                    }
                  />
                </figcaption>
              )}
            </figure>
          )}

          <Share
            url={'https://www.lib.umich.edu' + slug}
            title={field_title_context}
          />
          <StayInTheKnow />
        </TemplateSide>
      </Template>

      <Panels data={fullPanels} />
    </TemplateLayout>
  )
}

function StayInTheKnow() {
  const newsEmailSignUpURL =
    'https://visitor.r20.constantcontact.com/manage/optin?v=001cDYOOus5TIdow4bzSVycvvOQHeBTvaw-u-NrxVEBWd7CK3DPmM7o6fTauJmkB-PmyMdNV2isg8l8Y3gsqV07er-4bFAo3fZNo1cYkbzohp4%3D'

  return (
    <React.Fragment>
      <Heading
        level={2}
        size="2XS"
        css={{
          marginTop: SPACING['L'],
          paddingTop: SPACING['L'],
          borderTop: `solid 1px ${COLORS.neutral['100']}`,
          fontWeight: '600',
        }}
      >
        Stay in the know
      </Heading>
      <Text>
        {' '}
        <Link
          to={newsEmailSignUpURL}
          css={{
            display: 'inline-block',
          }}
        >
          Sign up for email updates
        </Link>{' '}
      </Text>
    </React.Fragment>
  )
}

export const query = graphql`
  query($slug: String!) {
    news: nodeNews(fields: { slug: { eq: $slug } }) {
      ...newsFragment
    }
  }
`
