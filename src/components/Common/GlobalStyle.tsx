import React, { FunctionComponent } from 'react'
import { Global, css } from '@emotion/react'
import reset from 'emotion-reset'

const defaultStyle = css`
  ${reset}

  body {
    font-family: Pretendard, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: #333;
  }
  html,
  body,
  #___gatsby,
  #gatsby-focus-wrapper {
    height: 100%;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`

const GlobalStyle: FunctionComponent = function () {
  return <Global styles={defaultStyle} />
}

export default GlobalStyle
