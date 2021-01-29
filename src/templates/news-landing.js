import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING } from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'
import Layout from '../components/layout'
import SEO from '../components/seo'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import Card from '../components/card'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import * as moment from 'moment'

import {
  Expandable,
  ExpandableChildren,
  ExpandableButton,
} from '@umich-lib/core'

export default function NewsLandingTemplate({ data }) {
  const node = data.page
  const news = processNewsData(data.featuredNews).concat(
    processNewsData(data.restNews)
  )
  const newsLibraryUpdates = processNewsData(data.newsLibraryUpdates)
  const newsMainInitialShow = 10
  const newsLibraryUpdatesInitialShow = 20

  const {
    title,
    field_title_context,
    body,
    fields,
    drupal_internal__nid,
  } = node
  const description = body && body.summary ? body.summary : null

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO
        title={title}
        drupalNid={drupal_internal__nid}
        description={description}
      />
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['L'],
          }}
        >
          {field_title_context}
        </Heading>
      </Margins>
      <Template>
        <TemplateContent>
          {body && (
            <div css={{ marginBottom: SPACING['XL'] }}>
              <HTML html={body.processed} />
            </div>
          )}

          {news && (
            <React.Fragment>
              <VisuallyHidden>
                <Heading level={2} size="L">
                  Main news
                </Heading>
              </VisuallyHidden>
              <Expandable>
                <ol>
                  <ExpandableChildren show={newsMainInitialShow}>
                    {news.map((item, i) => (
                      <li
                        key={'news-item-' + i}
                        css={{
                          marginBottom: SPACING['L'],
                        }}
                      >
                        <Card
                          href={item.href}
                          title={item.title}
                          subtitle={item.subtitle}
                          image={item.image}
                          horizontal
                        >
                          {item.description}
                        </Card>
                      </li>
                    ))}
                  </ExpandableChildren>
                </ol>

                {news.length > newsMainInitialShow && (
                  <ExpandableButton name="stories" count={news.length} />
                )}
              </Expandable>
            </React.Fragment>
          )}
        </TemplateContent>

        <TemplateSide>
          <Heading
            size="L"
            level={2}
            css={{
              marginBottom: SPACING['L'],
            }}
          >
            Library Updates
          </Heading>
          {newsLibraryUpdates && (
            <Expandable>
              <ol>
                <ExpandableChildren show={newsLibraryUpdatesInitialShow}>
                  {newsLibraryUpdates.map((item, i) => (
                    <li
                      key={'news-item-' + i}
                      css={{
                        marginBottom: SPACING['XL'],
                      }}
                    >
                      <Card
                        href={item.href}
                        title={item.title}
                        subtitle={item.subtitle}
                      />
                    </li>
                  ))}
                </ExpandableChildren>
              </ol>

              {newsLibraryUpdates.length > newsLibraryUpdatesInitialShow && (
                <ExpandableButton
                  name="updates"
                  count={newsLibraryUpdates.length}
                />
              )}
            </Expandable>
          )}
        </TemplateSide>
      </Template>
    </Layout>
  )
}

function processNewsData(data) {
  if (!data) {
    return []
  }

  return data.edges.map(({ node }) => {
    const { title, created, body, relationships, fields } = node
    const image =
      relationships?.field_media_image?.relationships?.field_media_image
        ?.localFile?.childImageSharp?.fluid

    return {
      title,
      subtitle: moment(created).format('MMMM D, YYYY'),
      description: body?.summary,
      href: fields.slug,
      image,
    }
  })
}

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    featuredNews: allNodeNews(
      filter: {
        field_news_type: { eq: "news_main" }
        field_featured_news_item: { eq: true }
      }
      sort: { fields: created, order: DESC }
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
    restNews: allNodeNews(
      filter: {
        field_news_type: { eq: "news_main" }
        field_featured_news_item: { eq: false }
      }
      sort: { fields: created, order: DESC }
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
    newsLibraryUpdates: allNodeNews(
      filter: {
        field_news_type: { eq: "library_updates" }
        relationships: {
          field_design_template: { field_machine_name: { eq: "news" } }
        }
      }
      sort: { fields: created, order: DESC }
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
  }
`
