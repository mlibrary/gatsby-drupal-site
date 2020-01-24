import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import {
  Heading,
  SPACING,
  Margins,
  TextInput,
  COLORS,
  Icon,
  Button,
  Alert,
  TYPOGRAPHY,
} from '@umich-lib/core'
import Img from 'gatsby-image'
import VisuallyHidden from '@reach/visually-hidden'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Link from '../components/link'
import Breadcrumb from '../components/breadcrumb'
import useDebounce from '../hooks/use-debounce'

const lunr = require('lunr')

export default function StaffDirectoryContainer() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const debouncedQuery = useDebounce(query, 250)
  const queryData = useStaticQuery(graphql`
    {
      allStaff(sort: { order: ASC, fields: uniqname }) {
        edges {
          node {
            uniqname
            name
            title
            email
            phone
            department_drupal_nid
          }
        }
      }
      allNodeDepartment {
        edges {
          node {
            title
            drupal_internal__nid
          }
        }
      }
      file(relativePath: { eq: "squirrel.png" }) {
        childImageSharp {
          fluid(maxWidth: 920) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  `)
  const image = queryData.file
  const departments = queryData.allNodeDepartment.edges.reduce(
    (acc, { node }) => {
      return {
        ...acc,
        [node.drupal_internal__nid]: node.title,
      }
    },
    {}
  )
  const staff = queryData.allStaff.edges.map(({ node }) => {
    return {
      ...node,
      department: departments[node.department_drupal_nid],
    }
  })

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

    if (!debouncedQuery) {
      setResults(staff)
      return
    }

    // Get the staff directory index
    const index = window.__SDI__

    try {
      const results = index.search(debouncedQuery).map(({ ref }) => {
        return staff.find(({ uniqname }) => uniqname === ref)
      })

      setResults(results)
    } catch {
      return
    }
  }, [debouncedQuery])

  function handleChange(e) {
    if (e.target.name === 'query') {
      setQuery(e.target.value)
    }
  }

  const filters = [
    {
      label: 'Department',
      name: 'department',
      options: ['All departments'].concat(
        Object.keys(departments)
          .map(d => departments[d])
          .sort()
      ),
    },
    {
      label: 'Division',
      name: 'division',
      options: ['All divisions'],
    },
  ]

  return (
    <StaffDirectory
      handleChange={handleChange}
      filters={filters}
      staff={staff}
      results={results}
      image={image}
    />
  )
}

function StaffDirectory({ handleChange, filters, results, image }) {
  const [show, setShow] = useState(20)
  const staffInView = results.slice(0, show)
  const resultsSummary = results.length
    ? `${results.length} results`
    : `No results`

  const showMoreText =
    show < results.length ? `${show} of ${results.length} people` : null

  function showMore() {
    setShow(results.length)
  }

  return (
    <Layout>
      <SEO title="Staff Directory" />
      <Margins
        css={{
          marginBottom: SPACING['4XL'],
        }}
      >
        <Breadcrumb
          data={JSON.stringify([
            {
              text: 'Home',
              to: '/',
            },
            {
              text: 'About Us',
              to: '/about-us',
            },
            {
              text: 'Staff Directory',
            },
          ])}
        />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['L'],
          }}
        >
          Staff Directory
        </Heading>

        <div
          css={{
            display: 'grid',
            gridTemplateColumns: `2fr 1fr 1fr`,
            gridGap: SPACING['S'],
            input: {
              lineHeight: '1.5',
              height: '40px',
            },
            marginBottom: SPACING['S'],
          }}
        >
          <TextInput
            id="search"
            labelText="Search by name, uniqname, or title"
            name="query"
            onChange={e => handleChange(e)}
          />
          {filters.map(({ label, name, options }) => (
            <Select label={label} name={name} options={options} />
          ))}
        </div>

        <table
          css={{
            width: '100%',
            tableLayout: 'fixed',
            marginBottom: SPACING['XL'],
            'th, td': {
              padding: `${SPACING['XS']} 0`,
              textAlign: 'left',
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
            },
            'td:not(:last-of-type)': {
              paddingRight: SPACING['XL'],
            },
            th: {
              color: COLORS.neutral['300'],
            },
          }}
        >
          <caption>
            <VisuallyHidden>
              <Alert>{resultsSummary}</Alert>
            </VisuallyHidden>
          </caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact info</th>
              <th colSpan="2">Title</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {staffInView.map(
              ({ uniqname, name, title, email, phone, department }) => (
                <tr key={uniqname}>
                  <td>
                    <Link to={`staff/` + uniqname}>{name}</Link>
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
                  <td colSpan="2">{title}</td>
                  <td>{department}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {showMoreText && (
          <>
            <p
              css={{
                marginBottom: SPACING['M'],
              }}
            >
              {showMoreText}
            </p>
            <Button onClick={showMore}>Show all</Button>
          </>
        )}

        {!results.length && <NoResults image={image} />}
      </Margins>
    </Layout>
  )
}

function NoResults({ image }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [hydrated])

  if (!hydrated) {
    return null
  }

  return (
    <div
      css={{
        textAlign: 'center',
        maxWidth: '32rem',
        margin: '0 auto',
        marginTop: SPACING['2XL'],
        marginBottom: SPACING['4XL'],
      }}
    >
      <Heading size="XL" level="2" css={{ marginBottom: SPACING['M'] }}>
        No results found
      </Heading>

      <ul
        css={{
          textAlign: 'left',
          listStyle: 'disc',
          li: {
            marginBottom: SPACING['S'],
          },
          strong: {
            fontWeight: '600',
          },
        }}
      >
        <li>
          Search <strong>"Lib*"</strong> to match anything that begins with
          "Lib" or <strong>"L*y"</strong> to match anything that begins with "L"
          and ends with "y" .
        </li>
        <li>
          Search <strong>"title:librarian"</strong> to match people with
          "librarian" in their title.
        </li>
        <li>
          Search <strong>"+map -digital"</strong> if it must contain "map" and
          not contain "digital".
        </li>
      </ul>

      <Img
        fluid={image.childImageSharp.fluid}
        alt=""
        css={{
          maxWidth: '16rem',
          margin: '0 auto',
          marginBottom: SPACING['L'],
        }}
      />
    </div>
  )
}

function Select({ label, name, options }) {
  return (
    <label>
      <span
        css={{
          display: 'block',
          marginBottom: SPACING['XS'],
        }}
      >
        {label}
      </span>
      <div
        css={{
          position: 'relative',
        }}
      >
        <select
          name={name}
          css={{
            // reset default <select> styles.
            display: 'block',
            width: '100%',
            appearance: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
            backgroundImage: 'none',
            padding: `${SPACING['XS']} ${SPACING['XS']}`,
            paddingRight: `2rem`,
            border: `solid 1px ${COLORS.neutral['300']}`,
            borderRadius: '4px',
            lineHeight: '1.5',
            height: '40px',
          }}
        >
          {options.map(opt => (
            <option id={name + opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Icon
          icon="expand_more"
          css={{
            position: 'absolute',
            right: SPACING['S'],
            bottom: SPACING['S'],
          }}
        />
      </div>
    </label>
  )
}
