import styled from '@emotion/styled'
import React, { FunctionComponent } from 'react'

const FooterWrapper = styled.footer`
  display: grid;
  place-items: center;
  margin-top: auto;
  padding: 50px 0;
  font-size: 16px;
  text-align: center;
  line-height: 1.5;
`

const Footer: FunctionComponent = function () {
  return (
    <FooterWrapper>
      Thanks for visiting MY Blog
      <br /> Developer Powered by Gatsby.
    </FooterWrapper>
  )
}

export default Footer
