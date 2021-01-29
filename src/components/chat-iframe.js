import React from 'react'

import { COLORS, Heading, SPACING, Z_SPACE } from '@umich-lib/core'

export default function ChatIframe() {
  return (
    <div
      css={{
        marginTop: SPACING['S'],
        maxWidth: '20rem',
        border: `solid 1px ${COLORS.neutral['100']}`,
        borderRadius: '4px',
        borderTop: `solid 2px ${COLORS.maize['400']}`,
        ...Z_SPACE['8'],
      }}
    >
      <Heading
        size="2XS"
        css={{
          display: 'flex',
          alignItems: 'center',
          padding: `${SPACING['2XS']} ${SPACING['S']}`,
        }}
      >
        <svg
          height="24"
          viewBox="0 0 24 24"
          width="24"
          css={{
            flexShrink: '0',
            marginRight: SPACING['M'],
            width: '32px',
            height: '32px',
          }}
        >
          <path
            d="m15.65 15.92v1.88a1.44 1.44 0 0 1 -.43 1 1.37 1.37 0 0 1 -1 .44h-10.3l-2.92 2.96v-13.2a1.39 1.39 0 0 1 .42-1 1.36 1.36 0 0 1 1-.43h5.93v6.9a1.4 1.4 0 0 0 .43 1 1.33 1.33 0 0 0 1 .44z"
            fill="#ffcc06"
          ></path>
          <path
            d="m21.53 4.24a1.45 1.45 0 0 1 1.47 1.45v13.2l-2.95-2.89h-10.28a1.37 1.37 0 0 1 -1-.44 1.47 1.47 0 0 1 -.42-1v-8.87a1.43 1.43 0 0 1 .42-1 1.39 1.39 0 0 1 1-.42z"
            fill="#10284b"
          ></path>
        </svg>
        Ask a Librarian
      </Heading>
      <div css={{}}>
        <iframe
          title="Ask a Librarian"
          width="100%"
          height="400px"
          src="https://libraryh3lp.com/chat/umlibraryaskalibrarian@chat.libraryh3lp.com?skin=27279"
          css={{
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  )
}
