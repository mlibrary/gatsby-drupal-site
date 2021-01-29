import React from 'react'
import { Link } from 'gatsby'

function PlainLink({ to, children, external, ...other }) {
  /*
    The check if the href is an internal link.
  */
  if (to.startsWith('/') && !external) {
    return (
      <Link to={to} {...other}>
        {children}
      </Link>
    )
  }

  // A regular anchor link. Probably an external link.
  return (
    <a href={to} {...other}>
      {children}
    </a>
  )
}

export default PlainLink
