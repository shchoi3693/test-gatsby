import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export type PostHeadInfoProps = {
  title: string
  date: string
  categories: string[]
}

const PostHeadInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 768px;
  height: 100%;
  margin: 0 auto;
  padding: 3rem 0;
  color: #fff;
  box-sizing: border-box;
`
const PrevPageIcon = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
`
const PrevIcon = styled.div`
  max-width: 40px;
`
const PrevPageTxt = styled.div`
  margin-left: 12px;
`

const Title = styled.h1`
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: break-word;
  margin-top: auto;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 42px;
  font-weight: 500;
  line-height: 1.5;
`
const PostData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  font-size: 15px;
  font-weight: 400;
`

const PostHeadInfo: FunctionComponent<PostHeadInfoProps> = ({
  title,
  date,
  categories,
}) => {
  const goBackPage = () => window.history.back()
  return (
    <PostHeadInfoWrapper>
      <PrevPageIcon onClick={goBackPage}>
        <PrevIcon>
          <FontAwesomeIcon icon={faArrowLeft} />
        </PrevIcon>
        <PrevPageTxt>All Posts</PrevPageTxt>
      </PrevPageIcon>
      <Title>{title}</Title>
      <PostData>
        <div>{categories.join(' | ')}</div>
        <div>{date}</div>
      </PostData>
    </PostHeadInfoWrapper>
  )
}

export default PostHeadInfo
