import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

export default function TemplateLayout({ node, children, ...rest }) {
  const { title, drupal_internal__nid, field_seo_keywords, body } = node
  const description = body && body.summary ? body.summary : null
  const keywords = field_seo_keywords ? field_seo_keywords.split(', ') : []

  return (
    <Layout drupalNid={drupal_internal__nid} {...rest}>
      <SEO title={title} keywords={keywords} description={description} />
      {children}
    </Layout>
  )
}
