import styled from '@emotion/styled'
import { SPACING } from '@umich-lib/core'

const Prose = styled('div')({
  '> *:not(:last-child)': {
    marginBottom: SPACING['M'],
  },
  '> h2:not(:last-child)': {
    marginTop: SPACING['2XL'],
  },
  '> h3:not(:last-child)': {
    marginTop: SPACING['M'],
  },
  '> h4:not(:last-child)': {
    marginTop: SPACING['M'],
  },
  '> h5:not(:last-child)': {
    marginTop: SPACING['M'],
  },
  li: {
    marginBottom: SPACING['XS'],
  },
  '[data-umich-lib-callout]': {
    maxWidth: '38rem',
  },
  '[data-umich-lib-callout] + [data-umich-lib-callout]': {
    marginTop: SPACING['L'],
  },
})

export default Prose
