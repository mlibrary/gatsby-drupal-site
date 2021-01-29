import { graphql } from 'gatsby'

export const query = graphql`
  fragment buildingCardFragment on node__building {
    id
    __typename
    title
    field_title_context
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    body {
      summary
    }
    fields {
      slug
      breadcrumb
    }
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
    field_access {
      processed
    }
    field_display_hours_
    field_hours_different_from_build
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 320) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
      field_hours_open {
        ...hoursFragment
      }
      field_parent_location {
        ... on node__location {
          field_display_hours_
          relationships {
            field_hours_open {
              ...hoursFragment
            }
          }
        }
      }
    }
  }
`
