import React, { useState, useEffect } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import {
  SPACING,
  Z_SPACE,
  COLORS,
  Icon,
  Alert,
  TYPOGRAPHY,
} from '@umich-lib/core'
import { findAll } from 'highlight-words-core'
import VisuallyHidden from '@reach/visually-hidden'
import ReachAlert from '@reach/alert'
import Link from '../components/link'
import HEADER_MEDIA_QUERIES from '../components/header/header-media-queries'
import useGoogleTagManager from '../hooks/use-google-tag-manager'

const lunr = require('lunr')

export default function SiteSearch({ label }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])

  useGoogleTagManager({
    eventName: 'siteSearch',
    value: query,
  })

  useEffect(() => {
    if (!query || !window.__LUNR__) {
      setResults([])
      return
    }
    const lunrIndex = window.__LUNR__['en']

    try {
      const searchResults = lunrIndex.index.query(q => {
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

      setResults(
        searchResults.map(({ ref }) => {
          return {
            ...lunrIndex.store[ref],
            slug: ref.split(' /')[1],
          }
        })
      )

      setError(null)
    } catch (e) {
      if (e instanceof lunr.QueryParseError) {
        setError({ query: query, error: e })
        return
      } else {
        console.log('Site search error', e)
      }
    }
  }, [query])

  const handleChange = e => setQuery(e.target.value)
  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Icon
        icon="search"
        size={20}
        data-site-search-icon
        css={{
          position: 'absolute',
          left: SPACING['XS'],
          color: COLORS.neutral['300'],
        }}
      />
      <label
        css={{
          width: '100%',
        }}
      >
        <VisuallyHidden>
          <p>{label}.</p>
          <p>
            To access results, <KeyboardControlIntructions />.
          </p>
        </VisuallyHidden>
        <input
          id="site-search-input"
          onChange={handleChange}
          placeholder={label}
          type="search"
          autoComplete="off"
          autocomplete={false}
          css={{
            fontSize: '1rem',
            appearance: 'textfield',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            width: '100%',
            background: 'none',
            borderRadius: '2px',
            padding: SPACING['XS'],
            paddingLeft: `calc(18px + ${SPACING['S']})`,
            border: `solid 1px ${COLORS.neutral['300']}`,
            alignItems: 'center',
            boxShadow: `inset 0 1px 4px rgba(0,0,0,0.1)`,
            '::placeholder': {
              color: COLORS.neutral['300'],
              opacity: 1,
            },
          }}
        />
      </label>

      <ResultsContainer results={results} query={query} error={error} />
    </div>
  )
}

function ResultsSummary({ searching, noResults, resultCount }) {
  if (noResults || !searching) {
    return null
  }

  const resultText = `${resultCount} result${resultCount > 1 ? 's' : ''}`

  return (
    <VisuallyHidden>
      <ReachAlert>{resultText}</ReachAlert>
    </VisuallyHidden>
  )
}

function ResultsContainer({ results, query, error }) {
  const searching = query.length > 0
  const noResults = searching && results.length === 0

  return (
    <React.Fragment>
      <ResultsSummary
        searching={searching}
        noResults={noResults}
        resultCount={results.length}
      />
      <ResultsList
        searching={searching}
        noResults={noResults}
        results={results}
        query={query}
        error={error}
      />
    </React.Fragment>
  )
}

function ResultsList({ searching, noResults, results, query, error }) {
  // If you're not searching, don't show anything.
  if (!searching) {
    return null
  }

  if (noResults) {
    return (
      <Popover error={error}>
        <NoResults query={query} />
      </Popover>
    )
  }

  return (
    <Popover error={error}>
      <p
        css={{
          padding: `${SPACING['S']} ${SPACING['L']}`,
          color: COLORS.neutral['300'],
          background: COLORS.blue['100'],
          borderBottom: `solid 1px ${COLORS.neutral['100']}`,
          kbd: {
            display: 'inline-block',
            border: `solid 1px ${COLORS.neutral['200']}`,
            fontFamily: 'monospace',
            borderRadius: '4px',
            fontSize: '0.85rem',
            padding: `0 ${SPACING['2XS']}`,
            background: 'white',
            boxShadow: `0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;`,
          },
        }}
        data-site-search-keyboard-instructions
      >
        <KeyboardControlIntructions />
      </p>
      <ol>
        {results.slice(0, 10).map((result, index) => (
          <li
            key={index}
            value={result.title}
            css={{
              mark: {
                fontWeight: '700',
                background: COLORS.maize['200'],
              },
              ':not(:last-child)': {
                borderBottom: `solid 1px ${COLORS.neutral['100']}`,
              },
            }}
          >
            <GatsbyLink
              to={'/' + result.slug}
              css={{
                display: 'block',
                padding: `${SPACING['M']} ${SPACING['L']}`,
                ':hover, :focus': {
                  outline: 'none',
                  background: COLORS.teal['100'],
                  borderLeft: `solid 4px ${COLORS.teal['400']}`,
                  paddingLeft: `calc(${SPACING['L']} - 4px)`,

                  '[data-title]': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              <p
                data-title
                css={{
                  ...TYPOGRAPHY['XS'],
                }}
                aria-label={result.title + '.'}
              >
                <HighlightText query={query} text={result.title} />
              </p>
              {result.summary && (
                <p
                  css={{
                    display: '-webkit-box',
                    color: COLORS.neutral['300'],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                  }}
                  aria-label={result.summary}
                >
                  <HighlightText query={query} text={result.summary} />
                </p>
              )}
            </GatsbyLink>
          </li>
        ))}
      </ol>
    </Popover>
  )
}

function KeyboardControlIntructions() {
  return (
    <React.Fragment>
      <kbd>tab</kbd> to navigate, <kbd>enter</kbd> to select, <kbd>esc</kbd> to
      dismiss
    </React.Fragment>
  )
}

/**
 * Renders the value as text but with spans wrapping the
 * matching and non-matching segments of text.
 */
function HighlightText({ query, text }) {
  const chunks = findAll({
    searchWords: query.split(/\s+/),
    textToHighlight: text,
  })

  const highlightedText = chunks.map(chunk => {
    const { end, highlight, start } = chunk
    const textChunk = text.substr(start, end - start)

    if (highlight) {
      return <mark>{textChunk}</mark>
    } else {
      return <React.Fragment>{textChunk}</React.Fragment>
    }
  })

  return highlightedText
}

function NoResults({ query }) {
  return (
    <p
      css={{
        padding: SPACING['L'],
        color: COLORS.neutral['300'],
      }}
    >
      <span
        css={{
          display: 'block',
          color: COLORS.neutral['400'],
          ...TYPOGRAPHY['XS'],
        }}
      >
        No results found for:{' '}
        <span
          css={{
            fontWeight: '700',
          }}
        >
          {query}
        </span>
      </span>
      <span
        css={{
          display: 'block',
        }}
      >
        Try <Link to="https://search.lib.umich.edu/">Library Search</Link> for
        books, articles, and more.
      </span>
    </p>
  )
}

function Popover({ children, error }) {
  return (
    <div
      css={{
        position: 'absolute',
        top: 'calc(44px + 0.25rem)',
        right: 0,
        background: 'white',
        zIndex: '999',
        width: '100%',
        ...Z_SPACE['16'],
        maxHeight: '70vh',
        overflow: 'hidden',
        overflowY: 'auto',
        border: `solid 1px ${COLORS.neutral['100']}`,
        borderRadius: '2px',
        [HEADER_MEDIA_QUERIES.LARGESCREEN]: {
          width: 'calc(100% + 12rem)',
        },
      }}
    >
      <div
        css={{
          borderBottom: `solid 1px`,
          borderBottomColor: COLORS.neutral['100'],
        }}
      >
        {error && <Alert intent="error">{error.error.message}</Alert>}
        {children}
      </div>
    </div>
  )
}
