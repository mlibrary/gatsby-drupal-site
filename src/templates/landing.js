import React from 'react'
import { graphql } from 'gatsby'

import { Margins } from '@umich-lib/core'

import Layout from '../components/layout'
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import HTML from '../components/html'
import Panels from '../components/panels'
import transformNodePanels from '../utils/transform-node-panels'

export default function LandingTemplate({ data, ...rest }) {
  const node = data.page
  const {
    title,
    field_title_context,
    body,
    fields,
    relationships,
    drupal_internal__nid,
  } = node
  const description = body && body.summary ? body.summary : null
  const { bodyPanels, fullPanels } = transformNodePanels({ node })

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO
        title={title}
        drupalNid={drupal_internal__nid}
        description={description}
      />
      <PageHeader
        breadcrumb={fields.breadcrumb}
        title={field_title_context}
        summary={body ? body.summary : null}
        image={
          relationships.field_media_image &&
          relationships.field_media_image.relationships.field_media_image
        }
      />
      <Margins>
        {body && <HTML html={body.processed} />} <Panels data={bodyPanels} />
      </Margins>
      <Panels data={fullPanels} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    parents: allNodePage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          title
          drupal_id
          fields {
            slug
          }
        }
      }
    }
  }
`
