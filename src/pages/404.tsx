import styled from '@emotion/styled'
import GlobalStyle from 'components/Common/GlobalStyle'
import { Link } from 'gatsby'
import React, { FunctionComponent } from 'react'

const NotFoundPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const NotFound404 = styled.div`
  font-size: 120px;
`
const NotFoundDescription = styled.div`
  margin-top: 24px;
  font-size: 18px;
`
const GoToMainButton = styled(Link)`
  margin-top: 32px;
  padding: 10px 24px;
  font-size: 18px;
  background-color: #eeeeee;
`

const NotFoundPage: FunctionComponent = function () {
  return (
    <NotFoundPageWrapper>
      <GlobalStyle />
      <NotFound404>404</NotFound404>
      <NotFoundDescription>찾을 수 없는 페이지입니다.</NotFoundDescription>
      <GoToMainButton to="/">메인으로</GoToMainButton>
    </NotFoundPageWrapper>
  )
}

export default NotFoundPage
