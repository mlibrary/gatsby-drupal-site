import { graphql } from 'gatsby'

export const query = graphql`
  fragment locationCardFragment on node__location {
    __typename
    title
    field_title_context
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    field_address_is_different_from_
    field_local_navigation
    body {
      summary
      processed
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
    field_url {
      uri
    }
    field_address_is_different_from_
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
      field_parent_page {
        __typename
        ... on node__section_page {
          ...sectionCardFragment
        }
      }
      field_parent_location {
        __typename
        ... on node__location {
          ...locationParentFragment
        }
        ... on node__building {
          ...buildingParentFragment
        }
      }
      field_visit {
        description {
          processed
        }
      }
      field_amenities {
        description {
          processed
        }
      }
      field_hours_open {
        ...hoursFragment
      }
      field_floor {
        name
        id
      }
    }
  }
`
