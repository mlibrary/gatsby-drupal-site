import { useStaticQuery, graphql } from 'gatsby'

export default function useFloorPlan(bid, fid) {
  const data = useStaticQuery(
    graphql`
      query {
        allNodeFloorPlan {
          edges {
            node {
              ...floorPlanFragment
            }
          }
        }
      }
    `
  )

  if (!bid && !fid) {
    return null
  }

  const { node } = data.allNodeFloorPlan.edges.find(({ node }) => {
    const { field_room_building, field_floor } = node.relationships

    // The floor plan node matches when building and floor id both match.
    return field_room_building.id === bid && field_floor.id === fid
  })

  return node
}
