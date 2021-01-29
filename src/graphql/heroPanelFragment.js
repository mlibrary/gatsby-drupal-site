import { graphql } from 'gatsby'

export const query = graphql`
  fragment heroPanelFragment on paragraph__hero_panel {
    __typename
    id
    field_caption_text {
      processed
    }
    field_background
    field_placement
    field_title
    field_link {
      title
      uri
    }
    relationships {
      field_hero_template {
        field_machine_name
      }
      field_hero_images {
        field_orientation
        field_media_image {
          alt
        }
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 960) {
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
