import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react'
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
import { useLocation, useNavigate } from '@reach/router'
import VisuallyHidden from '@reach/visually-hidden'
import Link from '../components/link'
import Breadcrumb from '../components/breadcrumb'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import NoResults from '../components/no-results'
import getUrlState, { stringifyState } from '../utils/get-url-state'
import Switch from '../components/switch'
import Select from '../components/select'
import processSpecialistData from '../utils/process-specialist-data'
import useGoogleTagManager from '../hooks/use-google-tag-manager'
import { useWindowSize } from '@reach/window-size'

const lunr = require('lunr')
const SpecialistsContext = createContext()

const SpecialistsProvider = ({ reducer, intialState, children }) => (
  <SpecialistsContext.Provider value={useReducer(reducer, intialState)}>
    {children}
  </SpecialistsContext.Provider>
)

const useSpecialists = () => useContext(SpecialistsContext)

export default function FinaASpecialistTemplate({ data }) {
  const [initialized, setInitialized] = useState(false)
  const [specialists, setSpecialists] = useState()
  const node = data.page
  const { body, fields, field_title_context } = node

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      setSpecialists(processSpecialistData({ data }))
    }
  }, [initialized, data])

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

        {specialists && <FindASpecialist specialists={specialists} />}
      </Margins>
    </TemplateLayout>
  )
}

function FindASpecialist({ specialists }) {
  const location = useLocation()
  const urlState = getUrlState(location.search, ['query', 'hs', 'category'])
  const results = specialists
  const initialState = {
    query: urlState.query ? urlState.query : '',
    specialists,
    results,
    stateString: stringifyState({
      query: urlState.query,
      hs: urlState.hs,
      category: urlState.category,
    }),
    healthSciencesOnly: urlState.hs ? true : false,
    category: urlState.category,
    categories: getCategories(specialists),
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setQuery':
        return {
          ...state,
          query: action.query,
          stateString: stringifyState({
            query: action.query.length > 0 ? action.query : undefined,
            hs: state.healthSciencesOnly ? true : undefined,
            category: state.category,
          }),
        }
      case 'setResults':
        return {
          ...state,
          results: action.results,
        }
      case 'setHealthSciencesOnly':
        return {
          ...state,
          healthSciencesOnly: action.healthSciencesOnly,
          category: undefined,
          stateString: stringifyState({
            query: state.query.length > 0 ? state.query : undefined,
            hs: action.healthSciencesOnly ? true : undefined,
            category: action.healthSciencesOnly ? state.category : undefined,
          }),
        }
      case 'setCategory':
        const category =
          action.category === 'All categories' ? undefined : action.category

        return {
          ...state,
          category: category,
          healthSciencesOnly: true,
          stateString: stringifyState({
            query: state.query.length > 0 ? state.query : undefined,
            hs: true,
            category: category,
          }),
        }
      case 'clear':
        return {
          ...initialState,
          query: '',
          healthSciencesOnly: state.healthSciencesOnly,
          category: undefined,
        }
      default:
        return state
    }
  }

  return (
    <SpecialistsProvider intialState={initialState} reducer={reducer}>
      <SpecialistsURLState />
      <SpecialistsSearchIndex />
      <SpecialistsGoogleTagManager />
      <SpecialistsSearch />
      <SpecialistsResults />
    </SpecialistsProvider>
  )
}

function SpecialistsURLState() {
  const location = useLocation()
  const navigate = useNavigate()
  const [{ stateString }] = useSpecialists()

  // When changes to state string represenation, set it to browser URL.
  useEffect(() => {
    // If there is state to be put in the URL, use that, otherwise,
    // clear the URL with the location pathname.
    const to = stateString.length > 0 ? '?' + stateString : location.pathname
    navigate(to, { replace: true, state: { preserveScroll: true } })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateString])

  return null
}

function SpecialistsSearchIndex() {
  const [{ query, specialists }, dispatch] = useSpecialists()

  useEffect(() => {
    if (!window.__FSI__) {
      window.__FSI__ = lunr(function() {
        this.ref('name')
        this.field('name')

        specialists.forEach(function(specialist) {
          this.add(specialist)
        }, this)
      })
    }

    // Get the Find a Specialist Index index (FSI)
    const index = window.__FSI__

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
          return specialists.find(({ name }) => name === ref)
        })

      dispatch({
        type: 'setResults',
        results: results,
      })
    } catch {
      return
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return null
}

function SpecialistsHealthSciencesOnly() {
  const [{ healthSciencesOnly }, dispatch] = useSpecialists() // TODO, replace with dispatch

  return (
    <Switch
      on={healthSciencesOnly}
      onClick={() =>
        dispatch({
          type: 'setHealthSciencesOnly',
          healthSciencesOnly: !healthSciencesOnly,
        })
      }
      css={{
        alignSelf: 'end',
        [MEDIA_QUERIES['L']]: {
          marginLeft: SPACING['M'],
        },
      }}
    >
      <span>Show Health Sciences only</span>
    </Switch>
  )
}

function SpecialistsCategorySelect() {
  const [
    { healthSciencesOnly, category, categories },
    dispatch,
  ] = useSpecialists()

  if (!healthSciencesOnly) {
    return null
  }

  return (
    <Select
      label={'Category'}
      name={'category'}
      options={['All categories'].concat(categories)}
      onChange={e =>
        dispatch({ type: 'setCategory', category: e.target.value })
      }
      value={category ? category : 'All categories'}
    />
  )
}

function SpecialistsGoogleTagManager() {
  const [{ query }] = useSpecialists()

  useGoogleTagManager({
    eventName: 'findASpecialistSearch',
    value: query,
  })

  return null
}

function SpecialistsSearch() {
  const [{ query, healthSciencesOnly }, dispatch] = useSpecialists()

  return (
    <div
      css={{
        display: 'grid',
        gridGap: SPACING['M'],
        [MEDIA_QUERIES['L']]: {
          gridTemplateColumns: healthSciencesOnly
            ? `minmax(200px, 3fr) auto auto auto`
            : `minmax(200px, 3fr) auto auto`,
        },
        input: {
          lineHeight: '1.5',
          height: '40px',
        },
        marginBottom: SPACING['M'],
      }}
    >
      <TextInput
        id="find-specialist-search-input"
        labelText="Search by subject or specialty"
        name="query"
        value={query}
        onChange={e => {
          dispatch({ type: 'setQuery', query: e.target.value })
        }}
      />
      <SpecialistsCategorySelect />
      <Button
        kind="subtle"
        onClick={() => dispatch({ type: 'clear' })}
        css={{
          alignSelf: 'end',
        }}
      >
        Clear
      </Button>
      <SpecialistsHealthSciencesOnly />
    </div>
  )
}

function SpecialistsResults() {
  const breakpoint = 720
  const { width } = useWindowSize()
  const [show, setShow] = useState(20)
  const [{ results, category, healthSciencesOnly }] = useSpecialists()
  const resultsFiltered = filterResults({
    results,
    category,
    healthSciencesOnly,
  })
  const resultsShown = resultsFiltered.slice(0, show)
  const resultsSummary = results.length
    ? `${resultsFiltered.length} results`
    : `No results`
  const showMoreText =
    show < resultsFiltered.length
      ? `Showing ${show} of ${resultsFiltered.length} results`
      : null
  function showMore() {
    setShow(results.length)
  }

  return (
    <React.Fragment>
      {width < breakpoint ? (
        <SpecialistsResultsSmallScreenResults
          results={resultsShown}
          healthSciencesOnly={healthSciencesOnly}
        />
      ) : (
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
                '> * + *': {
                  marginTop: SPACING['S'],
                },
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
                <th>Subjects and specialties</th>
                <th colSpan="2">Contact</th>
                {healthSciencesOnly && <th>Category</th>}
              </tr>
            </thead>
            <tbody>
              {resultsShown.map(({ name, contacts, category }, i) => (
                <tr key={name + i}>
                  <td>{name}</td>
                  <td colSpan="2">
                    {contacts.map(({ link, description }, y) => (
                      <div key={link.to + y}>
                        <Link to={link.to}>{link.label}</Link>
                        <p>{description}</p>
                      </div>
                    ))}
                  </td>
                  {healthSciencesOnly && <td>{category}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {!resultsFiltered.length && (
        <NoResults>Consider searching with different keywords.</NoResults>
      )}
    </React.Fragment>
  )
}

function SpecialistsResultsSmallScreenResults({ results, healthSciencesOnly }) {
  return (
    <ol>
      {results.map(({ name, contacts, category }, i) => (
        <li
          key={name + i}
          css={{
            borderTop: `solid 1px ${COLORS.neutral['100']}`,
            paddingTop: SPACING['M'],
            paddingBottom: SPACING['M'],
          }}
        >
          <h2
            css={{
              fontWeight: '600',
              marginBottom: SPACING['XS'],
            }}
          >
            {name}
          </h2>
          <ul
            css={{
              '> li:not(:last-child)': {
                marginBottom: SPACING['XS'],
              },
            }}
          >
            {contacts.map(({ link, description }, y) => (
              <li key={link.to + y}>
                <Link to={link.to}>{link.label}</Link>
                <p>{description}</p>
              </li>
            ))}
          </ul>
          {healthSciencesOnly && <p>{category}</p>}
        </li>
      ))}
    </ol>
  )
}

function filterResults({ results, healthSciencesOnly, category }) {
  let filteredResults = results

  if (healthSciencesOnly) {
    filteredResults = filteredResults.filter(
      result => result.category !== undefined
    )
  }

  if (category) {
    filteredResults = filteredResults.filter(
      result => result.category === category
    )
  }

  return filteredResults
}

function getCategories(specialists) {
  return Array.from(
    new Set(
      specialists
        .map(({ category }) => category)
        .filter(category => category !== undefined)
        .sort()
    )
  )
}

export const query = graphql`
  fragment specialistsSynonym on Node {
    id
    __typename
    ... on taxonomy_term__academic_discipline {
      name
    }
    ... on taxonomy_term__collecting_areas {
      name
    }
    ... on taxonomy_term__health_sciences {
      name
    }
    ... on taxonomy_term__library_expertise {
      name
    }
  }

  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    allTaxonomyTermAcademicDiscipline {
      edges {
        node {
          id
          name
          __typename
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
    allTaxonomyTermCollectingAreas {
      edges {
        node {
          id
          name
          __typename
          field_group_email
          field_brief_group_description
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
    allTaxonomyTermHealthSciences {
      edges {
        node {
          id
          name
          __typename
          field_group_email
          field_brief_group_description
          relationships {
            field_health_sciences_category {
              name
            }
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
    allTaxonomyTermLibraryExpertise {
      edges {
        node {
          id
          __typename
          name
          field_group_email
          field_brief_group_description
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
  }
`
