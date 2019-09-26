import { graphql } from 'gatsby'

export const query = graphql`
  fragment sectionFragment on node__section_page {
    title
    field_header_title
    drupal_id
    field_horizontal_nav_title
    field_root_page_
    drupal_internal__nid
    body {
      summary
      processed
    }
    fields {
      breadcrumb
      slug
    }
    relationships {
      field_parent_page {
        ...sectionCardFragment
        ...locationFragment
        ...buildingFragment
        ...roomFragment
      }
      field_design_template {
        field_machine_name
      }
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(
                  srcSetBreakpoints: [320, 640, 960, 1280]
                  maxWidth: 960
                  quality: 90
                ) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
                }
              }
            }
          }
        }
      }
      field_panels {
        ...CardPanelFragment
        ... on paragraph__text_panel {
          field_title
          id
          relationships {
            field_text_template {
              field_machine_name
            }
            field_text_card {
              field_title
              field_body {
                processed
              }
            }
          }
        }
        ... on paragraph__hours_panel {
          ...hoursPanelFragment
        }
      }
    }
  }
`