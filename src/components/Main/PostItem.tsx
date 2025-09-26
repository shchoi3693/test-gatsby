import styled from '@emotion/styled'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import React, { FunctionComponent } from 'react'
import { PostFrontmatterType } from 'types/PostItem.types'

type PostItemProps = PostFrontmatterType & { link: string }

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  transition: 0.3s box-shadow;
  &:hover {
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.18);
  }
`
const ThumbnailImage = styled(GatsbyImage)`
  width: 100%;
  height: 200px;
  border-radius: 8px 8px 0 0;
  //object-fit: cover; gatsby-plugin-image 속성에 있음
`
const PostItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px 14px;
`
const Title = styled.h3`
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
`
const Date = styled.div`
  font-size: 14px;
  color: #666;
`
const Category = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px -4px;
`
const CategoryItem = styled.div`
  margin: 3px 4px;
  padding: 4px 10px;
  border-radius: 3px;
  background-color: #555;
  font-size: 14px;
  color: white;
`
const Summary = styled.div`
  display: -webkit-box;
  overflow: hidden;
  margin-top: auto;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`

const PostItem: FunctionComponent<PostItemProps> = ({
  title,
  date,
  categories,
  summary,
  thumbnail: {
    childImageSharp: { gatsbyImageData },
  },
  link,
}) => {
  return (
    <PostItemWrapper to={link}>
      <ThumbnailImage image={gatsbyImageData} alt={title} />
      <PostItemContent>
        <Title>{title}</Title>
        <Date>{date}</Date>
        <Category>
          {categories?.map(category => (
            <CategoryItem key={category}>{category}</CategoryItem>
          ))}
        </Category>
        <Summary>{summary}</Summary>
      </PostItemContent>
    </PostItemWrapper>
  )
}

export default PostItem
