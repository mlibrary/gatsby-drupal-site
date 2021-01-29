import React from 'react'
import { Link } from 'gatsby'
import {
  Heading,
  SPACING,
  COLORS,
  MEDIA_QUERIES,
  Icon,
  LargeScreen,
} from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'

export default function SideNavigation({ to, branch }) {
  if (!branch) {
    return null
  }

  const title = branch.text
  const items = branch.children

  if (!items) {
    return null
  }

  return (
    <LargeScreen>
      <nav
        css={{
          display: 'none',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'block',
          },
        }}
        aria-labelledby="side-nav-heading"
      >
        <Heading size="S" level={2} id="side-nav-heading">
          {title}
        </Heading>
        <ol
          css={{
            marginTop: SPACING['XS'],
            marginBottom: SPACING['M'],
            '> li:not(:last-of-type)': {
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
            },
          }}
        >
          {items.map(item => (
            <li key={item.to + item.text}>
              <SideNavLink path={to} item={item}>
                {item.text}
              </SideNavLink>
            </li>
          ))}
        </ol>
      </nav>
    </LargeScreen>
  )
}

function SideNavLink({ path, item, children, ...rest }) {
  const hasChildren = item.children ? true : false
  const renderChildren = hasChildren && path.includes(item.to)
  const isActive = path === item.to

  return (
    <React.Fragment>
      <Link
        kind="list"
        to={item.to}
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: SPACING['S'],
          color: isActive ? COLORS.teal['400'] : 'inherit',
          fontWeight: isActive ? '700' : 'inherit',
          ':hover': {
            textDecoration: 'underline',
          },
          paddingTop: SPACING['M'],
          paddingBottom: renderChildren ? SPACING['XS'] : SPACING['M'],
        }}
        {...rest}
      >
        {children}
        {hasChildren && (
          <span
            css={{
              paddingLeft: SPACING['XS'],
              lineHeight: '1',
              color: COLORS.neutral['400'],
            }}
          >
            <VisuallyHidden>(has sub-pages)</VisuallyHidden>
            <Icon icon="expand_more" />
          </span>
        )}
      </Link>
      {renderChildren && (
        <ol
          css={{
            paddingBottom: SPACING['XS'],
          }}
        >
          {item.children.map(child => (
            <li>
              <SideNavLink
                key={path + child.text}
                path={path}
                item={child}
                css={{
                  padding: `${SPACING['XS']} 0`,
                  paddingLeft: SPACING['M'],
                }}
              >
                {child.text}
              </SideNavLink>
            </li>
          ))}
        </ol>
      )}
    </React.Fragment>
  )
}
