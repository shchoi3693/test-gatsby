import styled from '@emotion/styled'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import React, { FunctionComponent } from 'react'
import PostHeadInfo, { PostHeadInfoProps } from './PostHeadInfo'

type PostHeadProps = PostHeadInfoProps & {
  thumbnail: IGatsbyImageData
}

const PostHeadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  flex-shrink: 0;
`

// gatsby-plugin-image 인라인 스타일 순위 문제 시
// type GatsbyImgProps = {
//   image: IGatsbyImageData
//   alt: string
//   className?: string
// }
// const BackgroundImage = styled((props: GatsbyImgProps) => (
//   <GatsbyImage {...props} style={{ position: 'absolute' }} />
// ))`
//   z-index: -1;
//   width: 100%;
//   height: 400px;
//   object-fit: cover;
//   filter: brightness(0.25);
// `

const BackgroundImage = styled(GatsbyImage)`
  position: absolute;
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: brightness(0.25);
  z-index: -1;
`

const PostHead: FunctionComponent<PostHeadProps> = ({
  title,
  date,
  categories,
  thumbnail,
}) => {
  return (
    <PostHeadWrapper>
      <BackgroundImage image={thumbnail} alt={title} />
      <PostHeadInfo title={title} date={date} categories={categories} />
    </PostHeadWrapper>
  )
}

export default PostHead
