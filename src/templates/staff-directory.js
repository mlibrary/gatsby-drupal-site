import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import {
  Heading,
  SPACING,
  Margins,
  TextInput,
  COLORS,
  Button,
  Alert,
} from '@umich-lib/core'
import { useDebounce } from 'use-debounce'
import VisuallyHidden from '@reach/visually-hidden'
import BackgroundImage from 'gatsby-background-image'
import Link from '../components/link'
import PlainLink from '../components/plain-link'
import Breadcrumb from '../components/breadcrumb'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import NoResults from '../components/no-results'
import Select from '../components/select'
import StaffPhotoPlaceholder from '../components/staff-photo-placeholder'
import getUrlState, { stringifyState } from '../utils/get-url-state'
import useGoogleTagManager from '../hooks/use-google-tag-manager'
import { useWindowSize } from '@reach/window-size'

const lunr = require('lunr')

export default function StaffDirectoryWrapper({ data, location, navigate }) {
  const node = data.page
  const { allNodeDepartment, allStaff, allStaffImages } = data

  const departments = allNodeDepartment.edges.reduce((acc, { node }) => {
    return {
      ...acc,
      [node.drupal_internal__nid]: node,
    }
  }, {})
  const staff = allStaff.edges.map(({ node }) => {
    return {
      ...node,
      department: departments[node.department_nid],
      division: departments[node.division_nid],
    }
  })
  const staffImages = allStaffImages.edges.reduce((acc, { node }) => {
    const img = node.relationships.field_media_image

    return {
      ...acc,
      [img.drupal_internal__mid]: {
        alt: img.field_media_image.alt,
        ...img.relationships.field_media_image.localFile,
      },
    }
  }, {})

  return (
    <StaffDirectoryQueryContainer
      node={node}
      staff={staff}
      departments={departments}
      staffImages={staffImages}
      location={location}
      navigate={navigate}
    />
  )
}

function StaffDirectoryQueryContainer({
  node,
  staff,
  departments,
  staffImages,
  location,
  navigate,
}) {
  const [urlState] = useState(
    getUrlState(location.search, ['query', 'department'])
  )
  const { body, fields, field_title_context } = node
  const [query, setQuery] = useState(urlState.query ? urlState.query : '')
  const [activeFilters, setActiveFilters] = useState(
    urlState.department ? { department: urlState.department } : {}
  )
  const [results, setResults] = useState([])
  const [stateString] = useDebounce(
    stringifyState({
      query: query.length > 0 ? query : undefined,
      department: activeFilters['department'],
    }),
    100
  )

  useGoogleTagManager({
    eventName: 'staffDirectorySearch',
    value: query,
  })

  useEffect(() => {
    navigate('?' + stateString, {
      replace: true,
      state: { preserveScroll: true },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateString])

  useEffect(() => {
    if (!window.__SDI__) {
      // create staff directory index if it does not exist
      window.__SDI__ = lunr(function() {
        this.ref('uniqname')
        this.field('name')
        this.field('uniqname')
        this.field('title')

        staff.forEach(function(person) {
          this.add(person)
        }, this)
      })
    }

    // Get the staff directory index
    const index = window.__SDI__

    try {
      const results = index
        .query(q => {
          q.term(lunr.tokenizer(query), {
            boost: 3,
          })
          q.term(lunr.tokenizer(query), {
            boost: 2,
            wildcard: lunr.Query.wildcard.TRAILING,
          })
          if (query.length > 2) {
            q.term(lunr.tokenizer(query), {
              wildcard:
                lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING,
            })
          }
        })
        .map(({ ref }) => {
          return staff.find(({ uniqname }) => uniqname === ref)
        })

      setResults(filterResults({ activeFilters, results }))
    } catch {
      return
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeFilters])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'query') {
      setQuery(value)
      return
    }

    let activeFiltersCopy = { ...activeFilters }

    if (value.startsWith('All')) {
      delete activeFiltersCopy[name]
    } else {
      activeFiltersCopy = {
        ...activeFiltersCopy,
        [name]: value,
      }
    }

    setActiveFilters(activeFiltersCopy)
  }

  const filters = [
    {
      label: 'Department or division',
      name: 'department',
      options: ['All'].concat(
        Object.keys(departments)
          .map(d => departments[d].title)
          .sort()
      ),
    },
  ]

  function handleClear() {
    setQuery('')
    setActiveFilters({})
    setResults(staff)
  }

  return (
    <TemplateLayout node={node}>
      <Margins
        css={{
          marginBottom: SPACING['2XL'],
        }}
      >
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['S'],
          }}
        >
          {field_title_context}
        </Heading>

        {body && (
          <div
            css={{
              marginBottom: SPACING['XL'],
            }}
          >
            <HTML html={body.processed} />{' '}
          </div>
        )}

        <StaffDirectory
          handleChange={handleChange}
          handleClear={handleClear}
          filters={filters}
          activeFilters={activeFilters}
          results={results}
          staffImages={staffImages}
          query={query}
        />
      </Margins>
    </TemplateLayout>
  )
}

const StaffDirectory = React.memo(function StaffDirectory({
  handleChange,
  handleClear,
  filters,
  results,
  staffImages,
  query,
  activeFilters,
}) {
  const [show, setShow] = useState(20)
  const staffInView = results.slice(0, show)
  const resultsSummary = results.length
    ? `${results.length} results`
    : `No results`

  const showMoreText =
    show < results.length
      ? `Showing ${show} of ${results.length} results`
      : null

  function showMore() {
    setShow(results.length)
  }

  return (
    <React.Fragment>
      <div
        css={{
          display: 'grid',
          gridGap: SPACING['S'],
          [MEDIA_QUERIES['S']]: {
            gridTemplateColumns: `3fr 2fr auto`,
          },
          input: {
            lineHeight: '1.5',
            height: '40px',
          },
          marginBottom: SPACING['M'],
        }}
      >
        <TextInput
          id="staff-directory-search-input"
          labelText="Search by name, uniqname, or title"
          name="query"
          value={query}
          onChange={e => {
            setShow(20)
            handleChange(e)
          }}
        />
        {filters.map(({ label, name, options }) => (
          <Select
            label={label}
            name={name}
            options={options}
            onChange={e => handleChange(e)}
            value={activeFilters[name]}
          />
        ))}
        <Button
          kind="subtle"
          onClick={handleClear}
          css={{
            alignSelf: 'end',
          }}
        >
          Clear
        </Button>
      </div>

      <StaffDirectoryResults
        results={results}
        staffImages={staffImages}
        resultsSummary={resultsSummary}
        staffInView={staffInView}
      />

      {showMoreText && (
        <>
          <p
            css={{
              marginBottom: SPACING['L'],
            }}
          >
            {showMoreText}
          </p>
          <Button onClick={showMore}>Show all</Button>
        </>
      )}

      {!results.length && query.length > 0 && (
        <NoResults>
          Consider searching with different keywords or using the department or
          division filter to browse.
        </NoResults>
      )}
    </React.Fragment>
  )
})

function filterResults({ activeFilters, results }) {
  const filterKeys = Object.keys(activeFilters)

  if (filterKeys.length === 0) {
    return results
  }

  return results.filter(result => {
    const division = result.division && result.division.title
    const department = result.department && result.department.title

    return (
      activeFilters['department'] === division ||
      activeFilters['department'] === department
    )
  })
}

function StaffPhoto({ mid, staffImages }) {
  const img = staffImages[mid]

  if (!img) {
    return <StaffPhotoPlaceholder />
  }

  return (
    <BackgroundImage
      aria-hidden="true"
      data-card-image
      tag="div"
      fluid={img.childImageSharp.fluid}
      alt={img.alt}
      css={{
        width: '43px',
        height: '57px',
        backgroundColor: COLORS.blue['100'],
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    />
  )
}

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    allStaff(sort: { order: ASC, fields: name }) {
      edges {
        node {
          uniqname
          name
          title
          email
          phone
          department_nid
          division_nid
          image_mid
        }
      }
    }
    allStaffImages: allUserUser(
      filter: {
        relationships: {
          field_media_image: { drupal_internal__mid: { ne: null } }
        }
      }
    ) {
      edges {
        node {
          relationships {
            field_media_image {
              drupal_internal__mid
              field_media_image {
                alt
              }
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      fluid(maxWidth: 120) {
                        ...GatsbyImageSharpFluid_noBase64
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    allNodeDepartment {
      edges {
        node {
          title
          drupal_internal__nid
          fields {
            slug
          }
        }
      }
    }
  }
`

function StaffDirectoryResults({
  results,
  staffImages,
  resultsSummary,
  staffInView,
}) {
  const breakpoint = 820
  const { width } = useWindowSize()

  if (results.length < 1) {
    return null
  }

  if (width < breakpoint) {
    // prop drilling, woo!
    return (
      <StaffDirectorySmallScreenResults
        results={results}
        resultsSummary={resultsSummary}
        staffInView={staffInView}
      />
    )
  }

  return (
    <div
      css={{
        overflowX: 'auto',
      }}
      role="group"
      aria-labelledby="caption"
    >
      <table
        css={{
          width: '100%',
          minWidth: breakpoint + 'px',
          tableLayout: 'fixed',
          marginBottom: SPACING['XL'],
          'th, td': {
            padding: `${SPACING['S']} 0`,
            textAlign: 'left',
            borderBottom: `solid 1px ${COLORS.neutral['100']}`,
            verticalAlign: 'top',
          },
          'td:not(:last-of-type)': {
            paddingRight: SPACING['XL'],
          },
          th: {
            color: COLORS.neutral['300'],
          },
        }}
      >
        <caption
          id="caption"
          css={{
            textAlign: 'left',
          }}
        >
          <VisuallyHidden>
            <Alert>{resultsSummary}</Alert>
          </VisuallyHidden>

          <p
            css={{
              '@media only screen and (min-width: 720px)': {
                display: 'none',
              },
            }}
          >
            (Scroll to see more)
          </p>
        </caption>
        <thead>
          <tr>
            <th
              css={{
                paddingLeft: `calc(43px + ${SPACING['L']}) !important`,
              }}
              colSpan="2"
            >
              Name and title
            </th>
            <th>Contact info</th>
            <th colSpan="2">Department</th>
          </tr>
        </thead>
        <tbody>
          {staffInView.map(
            ({
              uniqname,
              name,
              title,
              email,
              phone,
              department,
              division,
              image_mid,
            }) => (
              <tr key={uniqname}>
                <td colSpan="2">
                  <div
                    css={{
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      css={{
                        display: 'inline-block',
                        width: '43px',
                        marginRight: SPACING['L'],
                        lineHeight: '0',
                        flexShrink: '0',
                      }}
                    >
                      <StaffPhoto mid={image_mid} staffImages={staffImages} />
                    </span>
                    <span>
                      <PlainLink
                        css={{
                          color: COLORS.teal['400'],
                          textDecoration: 'underline',
                          ':hover': {
                            textDecorationThickness: '2px',
                          },
                        }}
                        to={`/users/` + uniqname}
                      >
                        {name}
                      </PlainLink>
                      <span css={{ display: 'block' }}>{title}</span>
                    </span>
                  </div>
                </td>
                <td>
                  <span css={{ display: 'block' }}>
                    <Link to={`mailto:` + email} kind="subtle">
                      {email}
                    </Link>
                  </span>
                  {phone && (
                    <span>
                      <Link to={`tel:1-` + phone} kind="subtle">
                        {phone}
                      </Link>
                    </span>
                  )}
                </td>
                <td colSpan="2">
                  {department && (
                    <Link to={department.fields.slug} kind="subtle">
                      {department.title}
                    </Link>
                  )}

                  {!department && division && (
                    <Link to={division.fields.slug} kind="subtle">
                      {division.title}
                    </Link>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

function StaffDirectorySmallScreenResults({ resultsSummary, staffInView }) {
  return (
    <React.Fragment>
      <VisuallyHidden>
        <Alert>{resultsSummary}</Alert>
      </VisuallyHidden>

      <ol>
        {staffInView.map(({ uniqname, name, title, email, phone }) => (
          <li
            key={uniqname}
            css={{
              borderTop: `solid 1px ${COLORS.neutral['100']}`,
              paddingTop: SPACING['M'],
              paddingBottom: SPACING['M'],
            }}
          >
            <PlainLink
              css={{
                color: COLORS.teal['400'],
                textDecoration: 'underline',
                ':hover': {
                  textDecorationThickness: '2px',
                },
                display: 'block',
              }}
              to={`/users/` + uniqname}
            >
              {name}
            </PlainLink>

            <p css={{ display: 'block', marginBottom: SPACING['XS'] }}>
              {title}
            </p>
            <p>
              <Link to={`mailto:` + email} kind="subtle">
                {email}
              </Link>
              {phone && (
                <React.Fragment>
                  <span
                    css={{
                      display: 'inline-block',
                      padding: `0 ${SPACING['XS']}`,
                    }}
                    aria-hidden="true"
                  >
                    ·
                  </span>
                  <Link to={`tel:1-` + phone} kind="subtle">
                    {phone}
                  </Link>
                </React.Fragment>
              )}
            </p>
          </li>
        ))}
      </ol>
    </React.Fragment>
  )
}
