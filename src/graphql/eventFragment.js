import { graphql } from 'gatsby'

export const query = graphql`
  fragment eventFragment on node__events_and_exhibits {
    __typename
    id
    title
    field_title_context
    fields {
      slug
      breadcrumb
    }
    body {
      summary
      processed
    }
    field_event_date_s_ {
      value
      end_value
    }
    field_registration_link {
      uri
    }
    field_event_online
    field_online_event_link {
      uri
      title
    }
    field_event_in_non_library_locat
    field_non_library_location_addre {
      organization
      locality
      address_line1
      address_line2
      postal_code
      administrative_area
    }
    relationships {
      field_library_contact {
        field_user_display_name
        field_user_email
        name
      }
      field_non_library_event_contact {
        field_first_name
        field_last_name
        field_email
      }
      field_library_contact {
        field_user_display_name
        field_user_email
      }
      field_event_series {
        name
      }
      field_event_type {
        name
      }
      field_event_series {
        name
      }
      field_media_image {
        field_image_caption {
          processed
        }
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
    }
  }
`
