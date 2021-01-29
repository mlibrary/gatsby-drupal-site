/*
  # Find a Specialist nodes

  Take structured data created from Drupal JSON API
  gatsby-source-drupal plugin and create new nodes that
  are easier to use for the Find a Specialist template.

  Combine these terms across all 4 taxonomies
   1. Health Sciences
   2. Academic Discipline
   3. Collecting Areas
   4. Library Expertise

  Use the synonyms overriding priority above.
*/

export default function processSpecialistData({ data }) {
  const groups = [
    'allTaxonomyTermHealthSciences',
    'allTaxonomyTermAcademicDiscipline',
    'allTaxonomyTermCollectingAreas',
    'allTaxonomyTermLibraryExpertise',
  ]

  const flatten = groups.reduce((acc, group) => {
    return acc.concat(data[group].edges.map(({ node }) => node))
  }, [])

  let inheritedNodesIds = []

  const result = flatten.reduce((acc, node, i) => {
    if (inheritedNodesIds.includes(node.id)) {
      return acc
    }
    const children = flatten.slice(i + 1).filter(n => {
      const isChild = getChildren(n).find(c => node.id === c.id)
      return isChild
    })
    const userNodes = getUsers(node).concat(
      children.map(n => getUsers(n)).flat()
    )
    const uniqueUserNames = Array.from(
      new Set(userNodes.map(({ name }) => name))
    )
    const uniqueUserNodes = uniqueUserNames.map(name => {
      return userNodes.find(n => n.name === name)
    })
    const users = processUserNodes(uniqueUserNodes)
    inheritedNodesIds = Array.from(
      new Set(inheritedNodesIds.concat(children.map(child => child.id)))
    )
    const groupEmail = processGroupEmail({
      node,
    })
    const contacts = processContacts({
      groupEmail,
      users,
    })

    return acc.concat({
      name: node.name,
      contacts,
      category: node.relationships?.field_health_sciences_category?.name,
    })
  }, [])

  const sortedResult = [...result].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (nameA < nameB) {
      return -1
    }

    if (nameA > nameB) {
      return 1
    }

    return 0
  })

  function processUserNodes(nodes) {
    return nodes.map(
      ({ name, field_user_display_name, field_user_work_title }) => {
        return {
          link: {
            to: '/users/' + name,
            label: field_user_display_name,
          },
          description: field_user_work_title,
        }
      }
    )
  }

  function processGroupEmail({ node }) {
    const { field_group_email, field_brief_group_description } = node

    if (!field_group_email) {
      return []
    }

    return [
      {
        link: {
          to: 'mailto:' + field_group_email,
          label: field_group_email,
        },
        description: field_brief_group_description,
      },
    ]
  }

  /*
    If there is a groupEmail, use that.
    Otherwise use users, and if there are no users,
    use the Ask a Librarian contact.
  */
  function processContacts({ users, groupEmail }) {
    if (groupEmail.length > 0) {
      return groupEmail
    }

    if (users.length > 0) {
      return users
    }

    return [
      {
        link: {
          to: '/ask-librarian',
          label: 'Ask a Librarian',
        },
        description:
          'We can help you locate library resources, connect with a specialist, or find support at any stage of your project.',
      },
    ]
  }

  function getUsers(node) {
    const { relationships } = node
    const { user__user } = relationships
    const users = user__user ? user__user : []

    return users
  }

  function getChildren(node) {
    const { relationships } = node
    const { field_synonym } = relationships

    return field_synonym
  }

  return sortedResult
}
