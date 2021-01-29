import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'gatsby'
import VisuallyHidden from '@reach/visually-hidden'
import {
  SPACING,
  TYPOGRAPHY,
  COLORS,
  Icon,
  Margins,
  LINK_STYLES,
} from '@umich-lib/core'

import Logo from './logo'
import SiteSearchModal from '../site-search-modal'

const StateContext = createContext()

const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

const useStateValue = () => useContext(StateContext)

function SmallScreenHeader({ primary, secondary }) {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'setOpenNav':
        return {
          ...state,
          openNav: action.openNav,
        }
      case 'setOpen':
        return {
          ...state,
          open: action.open,
        }
      case 'setPanelOpen':
        return {
          ...state,
          panelOpen: action.panelOpen,
        }
      case 'reset':
        return {}
      default:
        return state
    }
  }

  return (
    <StateProvider initialState={{}} reducer={reducer}>
      <header
        css={{
          borderBottom: `solid 2px ${COLORS.neutral['100']}`,
          display: 'block',
          '@media only screen and (min-width: 1129px)': {
            display: 'none',
          },
        }}
      >
        <Margins>
          <div
            css={{
              position: 'relative',
            }}
          >
            <div
              css={{
                padding: `${SPACING['M']} 0`,
              }}
            >
              <Logo size={32} />
            </div>
            <Nav primary={primary} secondary={secondary} />
          </div>
        </Margins>
      </header>
    </StateProvider>
  )
}

function Nav({ primary, secondary }) {
  const [isSearching, setSearching] = useState(false)
  const [{ openNav, open }, dispatch] = useStateValue()
  const isOpen = openNav === true
  const toggleNavNode = useRef()

  return (
    <nav
      aria-label="Main and utility"
      css={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
    >
      <button
        onClick={() => setSearching(!isSearching)}
        css={{
          padding: `${SPACING['M']} ${SPACING['XS']}`,
        }}
      >
        <Icon icon="search" size={32} />
        <VisuallyHidden>Search this site</VisuallyHidden>
      </button>
      {isSearching && (
        <SiteSearchModal handleDismiss={() => setSearching(false)} />
      )}
      <button
        css={{
          padding: `${SPACING['M']} ${SPACING['XS']}`,
          marginRight: `-${SPACING['XS']}`,
          cursor: 'pointer',
        }}
        ref={toggleNavNode}
        aria-expanded={isOpen}
        onClick={() =>
          dispatch({
            type: 'setOpenNav',
            openNav: !isOpen,
          })
        }
      >
        {isOpen ? (
          <Icon icon="close" size={32} />
        ) : (
          <Icon d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={32} />
        )}
        <VisuallyHidden>Navigation</VisuallyHidden>
      </button>
      {isOpen && (
        <NavDropdown toggleNavNode={toggleNavNode}>
          {primary && <NavPrimary items={primary} />}
          {secondary && !Number.isInteger(open) && (
            <NavSecondary items={secondary} />
          )}
        </NavDropdown>
      )}
    </nav>
  )
}

function NavDropdown({ children, toggleNavNode }) {
  const [, dispatch] = useStateValue()
  const dropdownNode = useRef()

  /*
    Reset Nav state on unmount / close.
  */
  useEffect(() => {
    return () => {
      dispatch({
        type: 'reset',
      })
    }
  }, [dispatch])

  function closeDropdown() {
    dispatch({
      type: 'setOpenNav',
      open: null,
    })
  }

  function handleClick(e) {
    /*
      Double check the node is current.
    */
    if (dropdownNode.current) {
      /*
        If the user is clicking the primary nav button
        then they're clicking outside, but this button
        will handle closing for us. No need to close it
        from here.
      */
      if (toggleNavNode.current.contains(e.target)) {
        return
      }

      /*
        If the click is outside of the dropdown then
        close the dropdown.

        Except if they're click on the primary nav button,
        but this case is caught above.
      */
      if (!dropdownNode.current.contains(e.target)) {
        closeDropdown()
      }
    }
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) {
      // ESC key
      closeDropdown()
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleClick)
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('mouseup', handleClick)
      document.addEventListener('keydown', handleKeydown)
    }
  })

  return (
    <div
      css={{
        borderTop: `solid 1px ${COLORS.neutral[100]}`,
        position: 'absolute',
        width: '20rem',
        maxWidth: '84vw',
        background: 'white',
        right: 'calc(-1rem)', // Less the side site margin on small screens.
        boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.1)`,
        zIndex: '101',
      }}
      ref={dropdownNode}
    >
      {children}
    </div>
  )
}

function NavSecondary({ items }) {
  return (
    <ul aria-label="Utility">
      {items.map(({ to, text, icon }, i) => (
        <li key={i + text}>
          <Link
            to={to}
            css={{
              ...nav_item_styles,
              ...TYPOGRAPHY['3XS'],
              color: COLORS.neutral['300'],
              background: COLORS.blue['100'],
            }}
          >
            {icon && (
              <Icon
                icon={icon}
                css={{
                  marginRight: SPACING['2XS'],
                  marginTop: '-2px',
                }}
              />
            )}
            <span>{text}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function NavPrimary({ items }) {
  const [{ open }] = useStateValue()

  // Is an primary nav item open.
  if (Number.isInteger(open)) {
    return <NavPanelSecondary {...items[open]} />
  }

  return (
    <ul aria-label="Main">
      {items.map((item, i) => (
        <NavPrimaryItem {...item} i={i} key={i + item.text} />
      ))}
    </ul>
  )
}

function NavPrimaryItem({ to, text, children, i }) {
  const [{ open }, dispatch] = useStateValue()
  const isOpen = open === i

  return (
    <li>
      <button
        css={{
          ...nav_item_styles,
          justifyContent: 'space-between',
        }}
        aria-expanded={isOpen}
        onClick={() =>
          dispatch({
            type: 'setOpen',
            open: isOpen ? null : i,
          })
        }
      >
        {text} <NextIcon />
      </button>
    </li>
  )
}

function BeforeIcon() {
  return (
    <span
      css={{
        paddingRight: SPACING['S'],
        lineHeight: '1',
      }}
    >
      <Icon icon="navigate_before" size={24} />
    </span>
  )
}

function NextIcon() {
  return (
    <span
      css={{
        paddingLeft: SPACING['S'],
        lineHeight: '1',
      }}
    >
      <Icon icon="navigate_next" size={24} />
    </span>
  )
}

const nav_item_styles = {
  padding: SPACING['M'],
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  textAlign: 'left',
  borderBottom: `solid 1px ${COLORS.neutral['100']}`,
  textDecoration: 'none',
  color: COLORS.neutral['400'],
  cursor: 'pointer',
}

function NavPanelSecondary({ text, to, children }) {
  const [{ panelOpen }, dispatch] = useStateValue()
  const beforeNode = useRef(null)

  useEffect(() => {
    if (beforeNode.current) {
      beforeNode.current.focus()
    }
  }, [panelOpen])

  if (Number.isInteger(panelOpen)) {
    return <NavPanelTertiary {...children[panelOpen]} />
  }

  return (
    <div>
      <button
        css={{
          ...nav_item_styles,
        }}
        ref={beforeNode}
        aria-expanded={true}
        onClick={() =>
          dispatch({
            type: 'setOpen',
            open: null,
          })
        }
      >
        <BeforeIcon />
        <span css={{ fontWeight: '800' }}>{text}</span>
      </button>

      <ul>
        {children.map((item, i) => (
          <li key={i + item.text}>
            {item.children ? (
              <button
                css={{
                  ...nav_item_styles,
                  justifyContent: 'space-between',
                }}
                aria-expanded={false}
                onClick={() =>
                  dispatch({
                    type: 'setPanelOpen',
                    panelOpen: i,
                  })
                }
              >
                {item.text}
                <NextIcon />
              </button>
            ) : (
              <Link to={item.to} css={nav_item_styles}>
                {item.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NavPanelTertiary({ text, to, children }) {
  const [, dispatch] = useStateValue()
  const beforeNode = useRef()

  useEffect(() => {
    beforeNode.current.focus()
  }, [])

  return (
    <div>
      <button
        css={{
          ...nav_item_styles,
        }}
        onClick={() =>
          dispatch({
            type: 'setPanelOpen',
            panelOpen: null,
          })
        }
        ref={beforeNode}
        aria-expanded={true}
      >
        <BeforeIcon />
        <span css={{ fontWeight: '800' }}>{text}</span>
      </button>

      <ul>
        {children.map((item, i) => (
          <li key={i + item.text}>
            <Link to={item.to} css={nav_item_styles}>
              {item.text}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to={to}
            css={{
              ...nav_item_styles,
              fontSize: '1rem',
              fontWeight: '800',
              ':hover': {
                '.text': LINK_STYLES['list-strong'][':hover'],
              },
            }}
          >
            <span className="text" css={{ marginRight: '0.5rem' }}>
              View all {text}
            </span>
            <span>
              <Icon d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SmallScreenHeader
