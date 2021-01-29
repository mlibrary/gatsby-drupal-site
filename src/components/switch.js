import React from 'react'
import { SPACING, COLORS, TYPOGRAPHY } from '@umich-lib/core'

export default function Switch({ on, label, children, ...rest }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      css={{
        padding: SPACING['2XS'],
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
        ':focus [data-switch-track]': {
          outline: 'none',
          boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px ${COLORS.neutral['400']}`,
        },
        ':hover [data-switch-track]': {
          boxShadow: `0 0 0 4px ${COLORS.neutral['100']}`,
        },
      }}
      {...rest}
    >
      <span
        role="presentation"
        data-switch-track
        css={{
          position: 'relative',
          display: 'inline-block',
          height: '24px',
          width: '58px',
          marginRight: SPACING['XS'],
          background: on ? COLORS.green['500'] : COLORS.neutral['300'],
          border: `solid 2px`,
          borderColor: on ? COLORS.green['500'] : COLORS.neutral['300'],
          borderRadius: '16px',
          '[data-switch-knob]': {
            position: 'absolute',
            display: 'inline-block',
            height: '20px',
            width: '20px',
            top: '0px',
            left: on ? 'auto' : '0px',
            right: on ? '0px' : 'auto',
            borderRadius: '50%',
            background: 'white',
          },
          '[data-switch-label]': {
            ...TYPOGRAPHY['3XS'],
            position: 'absolute',
            display: 'inline-block',
            top: '2px',
            left: !on ? 'auto' : '8px',
            right: !on ? '5px' : 'auto',
            fontSize: '0.675rem',
            color: 'white',
          },
        }}
      >
        <span data-switch-label>{on ? 'on' : 'off'}</span>
        <span data-switch-knob />
      </span>
      {children}
    </button>
  )
}
