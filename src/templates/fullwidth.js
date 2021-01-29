import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING } from '@umich-lib/core'

import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import Panels from '../components/panels'
import getNode from '../utils/get-node'
import transformNodePanels from '../utils/transform-node-panels'

export default function FullWidthTemplate({ data, ...rest }) {
  const node = getNode(data)
  const { field_title_context, body, fields } = node
  const { bodyPanels, fullPanels } = transformNodePanels({ node })

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: fullPanels.length ? '0' : SPACING['XL'],
          }}
        >
          {field_title_context}
        </Heading>
      </Margins>

      <HorizontalNavigation
        data={data.parents}
        parentOrder={rest.pageContext.parents}
      />

      {body && (
        <Margins
          css={{
            marginBottom: fullPanels.length ? '0' : SPACING['5XL'],
          }}
        >
          <HTML html={body.processed} />

          <Panels data={bodyPanels} />
        </Margins>
      )}

      <Panels data={fullPanels} />
    </TemplateLayout>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    location: nodeLocation(fields: { slug: { eq: $slug } }) {
      ...locationFragment
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
