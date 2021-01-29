import { graphql } from 'gatsby'

export const query = graphql`
  fragment departmentFragment on node__department {
    __typename
    title
    field_title_context
    field_local_navigation
    drupal_id
    body {
      summary
      processed
    }
    field_what_were_working_on {
      processed
    }
    fields {
      slug
      breadcrumb
    }
    field_email
    field_fax_number
    field_make_an_appointment {
      uri
    }
    relationships {
      field_department_head {
        field_user_display_name
        name
      }
      field_panels {
        __typename
        ...linkPanelFragment
        ...textPanelFragment
      }
      field_media_file {
        relationships {
          field_media_file {
            localFile {
              publicURL
            }
          }
        }
      }
    }
  }
`
