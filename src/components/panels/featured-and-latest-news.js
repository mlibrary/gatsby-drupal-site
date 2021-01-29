import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import * as moment from 'moment'
import {
  SPACING,
  MEDIA_QUERIES,
  COLORS,
  Heading,
  Margins,
} from '@umich-lib/core'
import Card from '../card'
import Link from '../link'

function processNewsNodeForCard({ newsNode }) {
  const newsImage =
    newsNode.relationships?.field_media_image?.relationships?.field_media_image
      ?.localFile?.childImageSharp?.fluid

  const children = newsNode.body?.summary

  return {
    title: newsNode.title,
    subtitle: moment(newsNode.created).format('MMMM D, YYYY'),
    href: newsNode.fields.slug,
    image: newsImage,
    children,
  }
}

/*
  Experimenting with this layout system.
*/
const Layout = styled.div({
  display: 'grid',
  gridTemplateColumns: `
    [content-start] repeat(11, 1fr)
    1fr [content-end]
  `,
  gridGap: SPACING['S'],
  [MEDIA_QUERIES.LARGESCREEN]: {
    gridGap: SPACING['L'],
  },
})

export default function FeaturedAndLatestNews() {
  const data = useStaticQuery(graphql`
    query {
      featuredNews: allNodeNews(
        filter: { field_featured_news_item: { eq: true } }
        sort: { fields: created, order: DESC }
        limit: 1
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      priorityNews: allNodeNews(
        filter: {
          field_priority_for_homepage: { eq: true }
          field_featured_news_item: { eq: false }
        }
        sort: { fields: created, order: DESC }
        limit: 5
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      recentNews: allNodeNews(
        filter: {
          field_priority_for_homepage: { eq: false }
          field_featured_news_item: { eq: false }
        }
        sort: { fields: created, order: DESC }
        limit: 5
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      newsLandingPage: nodePage(
        relationships: {
          field_design_template: { field_machine_name: { eq: "news_landing" } }
        }
      ) {
        fields {
          slug
        }
      }
    }
  `)

  const featureNode = data.featuredNews.edges[0].node
  const featureCardProps = processNewsNodeForCard({ newsNode: featureNode })
  const recentNews = sortNews({ data })
  const recentNewsCardProps = recentNews.map(({ node }) => {
    return processNewsNodeForCard({ newsNode: node })
  })
  const viewAllNewsHref = data.newsLandingPage.fields.slug

  return (
    <Margins>
      <Layout
        css={{
          margin: `${SPACING['3XL']} 0`,
        }}
      >
        <div
          css={{
            gridColumn: 'content-start / content-end',
            [MEDIA_QUERIES.LARGESCREEN]: {
              gridColumn: 'content-start / span 6',
            },
          }}
        >
          <Heading
            level={2}
            size="M"
            css={{
              marginBottom: SPACING['L'],
            }}
          >
            Feature
          </Heading>
          <div
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                paddingRight: SPACING['XL'],
                borderRight: `solid 1px ${COLORS.neutral['100']}`,
              },
            }}
          >
            <Card
              title={featureCardProps.title}
              subtitle={featureCardProps.subtitle}
              href={featureCardProps.href}
              image={featureCardProps.image}
            >
              {featureCardProps.children}
            </Card>
          </div>
        </div>

        <div
          css={{
            gridColumn: 'content-start / content-end',
            [MEDIA_QUERIES.LARGESCREEN]: {
              gridColumn: 'span 6',
            },
          }}
        >
          <Heading
            level={2}
            size="M"
            css={{
              marginTop: SPACING['XL'],
              marginBottom: SPACING['L'],
              [MEDIA_QUERIES.LARGESCREEN]: {
                marginTop: 0,
              },
            }}
          >
            Recent news
          </Heading>

          <ol
            css={{
              '> li': {
                marginBottom: SPACING['XL'],
              },
            }}
          >
            {recentNewsCardProps.map(({ title, subtitle, href }, i) => (
              <li key={i + href}>
                <Card title={title} subtitle={subtitle} href={href} />
              </li>
            ))}
          </ol>

          <Link to={viewAllNewsHref}>View all news and stories</Link>
        </div>
      </Layout>
    </Margins>
  )
}

function sortNews({ data }) {
  const priorityNewsCount = data.priorityNews.edges.length

  // If there is no priority news, just send back recent news.
  if (priorityNewsCount === 0) {
    return data.recentNews
  }

  // Otherwise, merge the two, sort by date.
  const recentNewsSliced = data.recentNews.edges.slice(0, 5 - priorityNewsCount)
  const allNews = data.priorityNews.edges.concat(recentNewsSliced)

  function compareCreatedDate(a, b) {
    if (moment(a.node.created).isBefore(b.node.created)) {
      return 1
    }

    if (moment(a.node.created).isAfter(b.node.created)) {
      return -1
    }

    return 0
  }

  const sorted = [...allNews].sort(compareCreatedDate)

  return sorted
}
