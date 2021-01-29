import { graphql } from 'gatsby'

export const query = graphql`
  fragment linkPanelFragment on paragraph__link_panel {
    __typename
    id
    field_title
    field_link {
      uri
      title
    }
    field_view_all {
      uri
      title
    }
    field_border
    field_placement
    relationships {
      field_link_template {
        field_machine_name
      }
    }
  }
`
