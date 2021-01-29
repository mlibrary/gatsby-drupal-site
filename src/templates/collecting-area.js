import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Margins, Heading, SPACING, COLORS } from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import transformNodePanels from '../utils/transform-node-panels'
import getNode from '../utils/get-node'
import Panels from '../components/panels'
import UserCard from '../components/user-card'

function processContacts(userData) {
  if (!userData) {
    return null
  }

  const userList = userData.reduce((memo, user) => {
    const {
      name,
      field_user_display_name,
      field_user_work_title,
      field_user_email,
      field_user_phone,
      relationships,
    } = user
    const { field_media_image } = relationships
    var image

    if (field_media_image && field_media_image) {
      image = {
        alt: field_media_image.field_media_image.alt,
        fluid:
          field_media_image.relationships.field_media_image.localFile
            .childImageSharp.fluid,
      }
    }

    return memo.concat({
      uniqname: name,
      name: field_user_display_name,
      title: field_user_work_title,
      to: '/users/' + name,
      phone: field_user_phone === '000-000-0000' ? null : field_user_phone,
      email: field_user_email,
      image,
    })
  }, [])

  const userListSorted = userList.sort(function(a, b) {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()

    if (nameA < nameB) {
      return -1
    }

    if (nameA > nameB) {
      return 1
    }

    return 0
  })

  return userListSorted
}

function CollectingAreaTemplate({ data, ...rest }) {
  const node = getNode(data)
  const { field_title_context, body, fields, relationships } = node
  const { bodyPanels, fullPanels } = transformNodePanels({ node })
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const imageCaption =
    relationships.field_media_image &&
    relationships.field_media_image.field_image_caption
      ? relationships.field_media_image.field_image_caption.processed
      : null
  const contacts = processContacts(
    relationships.field_collecting_area.relationships.user__user
  )

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
              marginBottom: SPACING['L'],
            }}
          >
            {field_title_context}
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
                    paddingBottom: SPACING['XL'],
                    marginBottom: SPACING['XL'],
                    borderBottom: `solid 1px ${COLORS.neutral['100']}`,
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

          {contacts && (
            <React.Fragment>
              <Heading
                level={2}
                size="M"
                css={{
                  marginTop: SPACING['XL'],
                }}
              >
                Contact
              </Heading>
              {contacts.map(contact => (
                <UserCard key={contact.uniqname} {...contact} />
              ))}
            </React.Fragment>
          )}
        </TemplateSide>
      </Template>

      <Panels data={fullPanels} />
    </TemplateLayout>
  )
}

export default CollectingAreaTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
  }
`
