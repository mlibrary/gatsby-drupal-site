const path = require(`path`)
const { fetch } = require('./fetch')
const { createBreadcrumb } = require(`./create-breadcrumb`)
const { createStaffNodes } = require(`./create-staff-nodes`)
const {
  createNetlifyRedirectsFile,
  createLocalRedirects,
} = require('./create-redirects')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

function removeTrailingSlash(s) {
  return s.replace(/\/$/, '')
}

/*
  Custom Drupal APIs created with Drupal views
  can make "empty" results of varying nested
  levels of arrays.

  This is to check if the returned data
  has values or is empty with all the potential
  nested empty arrays.

  [ [ [] ] ]
*/
function sanitizeDrupalView(data) {
console.log(data)
  // Everything is wrapped in an array because Drupal views.
  if (Array.isArray(data)) {
    // We're looking for objects {}. If it's not an array
    // Let's assume it's an object with values.
    if (data[0] && !Array.isArray(data[0])) {
      return data
    }
  }

  return null
}

/*
  sourceNodes is only called once per plugin by Gatsby.
*/
exports.sourceNodes = async ({ actions, createContentDigest }, { baseUrl }) => {
  const { createTypes, createNode } = actions
  const typeDefs = `
    type HTML {
      processed: String
    }

    type paragraph__hero_panel implements Node {
      field_caption_text: HTML
    }
  `
  console.log(typeDefs)

  createTypes(typeDefs)

  /*
      Transform Drupal data and make a list of this shape:
      {
        text: 'Some page title',
        description: 'a string that describes the item',
        to: '/to-the/thing',
        children: [... more of these objects],
      }
    */
  function processDrupalNavData(data) {
console.log(data)
    return data.map(item => {
      let navItem = {
        text: item.text,
        to: item.to,
      }

      if (item.description && item.description.length) {
        navItem.description = item.description
      }

      if (item.children && item.children.length) {
        navItem.children = processDrupalNavData(item.children)
      }

      if (item.field_icon) {
        navItem.icon = item.field_icon
      }

      return navItem
    })
  }

  /*
    Create navigation nodes.
  */
  function createNavNode(id, type, data) {
console.log(data)
    const processedData = processDrupalNavData(data)

    const nodeMeta = {
      id,
      parent: null,
      children: [],
      internal: {
        type: type,
        content: JSON.stringify(data),
        contentDigest: createContentDigest(processedData),
      },
      nav: processedData,
    }
    createNode(nodeMeta)
  }

  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl)

  /*
    Fetch data from Drupal for primary and utlity,
    process it, then create nodes for each.
  */
  const nav_primary_data = await fetch(
    baseUrlWithoutTrailingSlash + '/api/nav/primary'
  )
  createNavNode('nav-primary', 'NavPrimary', nav_primary_data[0].children)

  const nav_utility_data = await fetch(
    baseUrlWithoutTrailingSlash + '/api/nav/utility'
  )
  createNavNode('nav-utlity', 'NavUtility', nav_utility_data[0].children)

  /*
    Fetch Staff person related data. Used for creating
    Staff Directory and Specialist pages.
  */
  const staffRawData = await fetch(baseUrlWithoutTrailingSlash + '/api/staff')
  createStaffNodes({ createNode, staffRawData })

  // Tell Gatsby we're done.
  return
}

/*
  This is important for setting up breadcrumbs, slug, and
  page title for nodes that become pages.

  Take the the graphql node __typename and trim "node__" from it.
  so "node__events_and_exhibits" => "events_and_exhibits".
*/
const drupal_node_types_we_care_about = [
  'page',
  'building',
  'section_page',
  'location',
  'room',
  'floor_plan',
  'department',
  'news',
  'events_and_exhibits',
]

// Create a slug for each page and set it as a field on the node.
exports.onCreateNode = async ({ node, actions }, { baseUrl }) => {
  const { createNodeField } = actions
  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl)
console.log(node)
  // Check for Drupal node type.
  // Substring off the "node__" part.
  if (
    drupal_node_types_we_care_about.includes(node.internal.type.substring(6))
  ) {
    // Handle creating breadcrumb for node.
    createBreadcrumb({
      node,
      createNodeField,
      baseUrl: baseUrlWithoutTrailingSlash,
    })

    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias,
    })

    createNodeField({
      node,
      name: `title`,
      value: node.title,
    })
  }

  async function createParentChildFields(fieldId, name) {
console.log(name)
    if (node[fieldId]) {
      const url = baseUrlWithoutTrailingSlash + node[fieldId]
      const data = await fetch(url)
      const sanitizedData = sanitizeDrupalView(data)
      const value = sanitizedData
        ? sanitizedData.map(({ uuid }) => uuid)
        : [`no-${name}`]

      createNodeField({
        node,
        name,
        value,
      })
    }

    return
  }

  await createParentChildFields('field_parent_menu', 'parents')
  await createParentChildFields('field_child_menu', 'children')
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }, { baseUrl }) => {
  const { createPage, createRedirect } = actions

  createLocalRedirects({ createRedirect })

  return new Promise((resolve, reject) => {
    const basicTemplate = path.resolve(`src/templates/basic.js`)
    const fullWidthTemplate = path.resolve(`src/templates/fullwidth.js`)
    const landingTemplate = path.resolve(`src/templates/landing.js`)
    const sectionTemplate = path.resolve(`src/templates/section.js`)
    const visitTemplate = path.resolve(`src/templates/visit.js`)
    const homeTemplate = path.resolve(`src/templates/home.js`)
    const floorPlanTemplate = path.resolve(`src/templates/floor-plan.js`)
    const destinationBodyTemplate = path.resolve(
      `src/templates/destination-body.js`
    )
    const destinationFullTemplate = path.resolve(
      `src/templates/destination-full.js`
    )
    const staffDirectoryTemplate = path.resolve(
      `src/templates/staff-directory.js`
    )
    const specialistTemplate = path.resolve(`src/templates/specialist.js`)
    const collectingAreaTemplate = path.resolve(
      `src/templates/collecting-area.js`
    )
    const departmentTemplate = path.resolve(`src/templates/department.js`)
    /*
      News templates
    */
    const newsLandingTemplate = path.resolve(`src/templates/news-landing.js`)
    const newsTemplate = path.resolve(`src/templates/news.js`)

    /*
      Events and Exhibits templates.
    */
    const eventTemplate = path.resolve(`src/templates/event.js`)

    function getTemplate(node) {
      const { field_machine_name } = node.relationships.field_design_template
console.log(node)
      switch (field_machine_name) {
        case 'basic':
          return basicTemplate
        case 'homepage':
          return homeTemplate
        case 'full_width':
          return fullWidthTemplate
        case 'landing_page':
          return landingTemplate
        case 'section':
        case 'section_locaside':
          return sectionTemplate
        case 'visit':
          return visitTemplate
        case 'destination_body':
          return destinationBodyTemplate
        case 'destination_full':
          return destinationFullTemplate
        case 'staff_directory':
          return staffDirectoryTemplate
        case 'floor_plan':
          return floorPlanTemplate
        case 'collecting_area':
          return collectingAreaTemplate
        case 'specialist':
          return specialistTemplate
        case 'department':
          return departmentTemplate
        case 'news_landing':
          return newsLandingTemplate
        case 'news':
          return newsTemplate
        case 'event_exhibit':
          return eventTemplate
        default:
          return null
      }
    }

    // Query for nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            pages: allNodePage(
              filter: {
                field_redirect_node: { eq: false }
                relationships: {
                  field_design_template: {
                    field_machine_name: {
                      in: [
                        "landing_page"
                        "basic"
                        "full_width"
                        "homepage"
                        "destination_body"
                        "destination_full"
                        "staff_directory"
                        "collecting_area"
                        "specialist"
                        "news_landing"
                      ]
                    }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    parents
                    children
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  field_seo_keywords
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            sections: allNodeSectionPage(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { in: ["section", "section_locaside"] }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    parents
                    children
                  }
                  drupal_internal__nid
                  field_seo_keywords
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            buildings: allNodeBuilding(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { in: ["visit"] }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    children
                    parents
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            rooms: allNodeRoom(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: {
                      in: [
                        "visit"
                        "basic"
                        "destination_body"
                        "destination_full"
                      ]
                    }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    children
                    parents
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            locations: allNodeLocation(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: {
                      in: [
                        "visit"
                        "full_width"
                        "destination_body"
                        "destination_full"
                      ]
                    }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    children
                    parents
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            profiles: allUserUser(
              filter: { field_make_profile_public: { eq: true } }
            ) {
              edges {
                node {
                  __typename
                  field_make_profile_public
                  field_user_display_name
                  field_user_work_title
                  name
                }
              }
            }
            floorPlans: allNodeFloorPlan(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { eq: "floor_plan" }
                  }
                }
              }
            ) {
              edges {
                node {
                  __typename
                  title
                  drupal_internal__nid
                  fields {
                    slug
                    title
                    breadcrumb
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            departments: allNodeDepartment(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { eq: "department" }
                  }
                }
              }
            ) {
              edges {
                node {
                  __typename
                  title
                  drupal_internal__nid
                  fields {
                    slug
                    title
                    breadcrumb
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            news: allNodeNews(
              filter: {
                relationships: {
                  field_design_template: { field_machine_name: { eq: "news" } }
                }
              }
            ) {
              edges {
                node {
                  __typename
                  title
                  drupal_internal__nid
                  fields {
                    slug
                    title
                    breadcrumb
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            events: allNodeEventsAndExhibits(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { eq: "event_exhibit" }
                  }
                }
              }
            ) {
              edges {
                node {
                  __typename
                  title
                  drupal_internal__nid
                  fields {
                    slug
                    title
                    breadcrumb
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        /*
          Make CMS pages that have configurable templates.
        */
        const {
          pages,
          sections,
          buildings,
          rooms,
          locations,
          floorPlans,
          departments,
          news,
          events,
        } = result.data
        const edges = pages.edges
          .concat(sections.edges)
          .concat(buildings.edges)
          .concat(rooms.edges)
          .concat(locations.edges)
          .concat(floorPlans.edges)
          .concat(departments.edges)
          .concat(news.edges)
          .concat(events.edges)

        edges.forEach(({ node }) => {
          const template = getTemplate(node)
          const summary = node.body ? node.body.summary : null
          const keywords = node.field_seo_keywords
            ? node.field_seo_keywords
            : ''

          if (template) {
            createPage({
              path: node.fields.slug,
              component: template,
              context: {
                ...node.fields,
                title: node.title,
                drupal_nid: node.drupal_internal__nid,
                summary,
                keywords: keywords,
              },
            })
          }
        })

        /*
          Make non CMS template pages
        */
        const { profiles } = result.data

        profiles.edges.forEach(({ node }) => {
          const profileTemplate = path.resolve(`src/templates/profile.js`)

          createPage({
            path: `/users/${node.name}`,
            component: profileTemplate,
            context: {
              name: node.name,
              title: node.field_user_display_name,
              summary: node.field_user_work_title, // used for site search
              isProfile: true,
            },
          })
        })
      })
    )
  })
}

exports.onPreBootstrap = async ({}, { baseUrl }) => {
  createNetlifyRedirectsFile({ baseUrl: removeTrailingSlash(baseUrl) })
}
