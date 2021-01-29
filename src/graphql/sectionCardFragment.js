import { graphql } from 'gatsby'

export const query = graphql`
  fragment sectionCardFragment on node__section_page {
    __typename
    title
    field_title_context
    drupal_internal__nid
    drupal_id
    fields {
      slug
    }
    body {
      summary
    }
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 920) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    }
  }
`
