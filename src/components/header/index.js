import React from 'react'
import HeaderLargeScreen from './header-largescreen'
import HeaderSmallScreen from './header-smallscreen'

function Header({ primary, secondary }) {
  return (
    <React.Fragment>
      <HeaderSmallScreen primary={primary} secondary={secondary} />
      <HeaderLargeScreen primary={primary} secondary={secondary} />
    </React.Fragment>
  )
}

export default Header
