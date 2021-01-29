import { graphql } from 'gatsby'

export const query = graphql`
  fragment newsFragment on node__news {
    __typename
    drupal_id
    title
    field_title_context
    created
    body {
      summary
      processed
    }
    fields {
      slug
      breadcrumb
    }
    field_priority_for_homepage
    relationships {
      field_panels {
        ...textPanelFragment
      }
      field_media_image {
        field_image_caption {
          processed
        }
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
