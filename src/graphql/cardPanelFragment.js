import { graphql } from 'gatsby'

export const query = graphql`
  fragment cardPanelFragment on paragraph__card_panel {
    __typename
    field_title
    drupal_id
    id
    field_placement
    relationships {
      field_card_template {
        field_machine_name
      }
      field_cards {
        ...buildingCardFragment
        ...locationCardFragment
        ...roomCardFragment
        ...pageCardFragment
        ...floorPlanFragment
        ...departmentFragment
        ...sectionCardFragment
      }
    }
  }
`
