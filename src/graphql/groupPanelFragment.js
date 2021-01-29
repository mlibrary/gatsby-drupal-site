import { graphql } from 'gatsby'

export const query = graphql`
  fragment groupPanelFragment on paragraph__group_panel {
    __typename
    id
    field_panel_group_layout
    relationships {
      field_panel_group {
        __typename
        ...linkPanelFragment
        ...textPanelFragment
      }
    }
  }
`
