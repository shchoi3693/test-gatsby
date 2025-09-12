import styled from '@emotion/styled'
import { Link } from 'gatsby'
import React, { FunctionComponent, ReactNode } from 'react'

export type CategoryListProps = {
  selectedCategory: string
  categoryList: { [key: string]: number }
}

const CategoryListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 100px auto 0;
  @media (max-width: 768px) {
    margin-top: 50px;
    padding: 0 20px;
  }
`

type CategoryItemProps = {
  active: boolean
}
type GatsbyLinkProps = {
  children: ReactNode
  className?: string
  to: string
} & CategoryItemProps
const CategoryItem = styled(({ active, ...props }: GatsbyLinkProps) => (
  <Link {...props} />
))<CategoryItemProps>`
  margin-right: 20px;
  padding: 5px 0;
  font-size: 16px;
  font-weight: ${({ active }) => (active ? '700' : '400')};
  color: #333;
  &:last-of-type {
    margin-right: 0;
  }
`

const CategoryList: FunctionComponent<CategoryListProps> = ({
  selectedCategory,
  categoryList,
}) => {
  return (
    <CategoryListWrapper>
      {Object.entries(categoryList).map(([name, count]) => (
        <CategoryItem
          key={name}
          active={name === selectedCategory}
          to={`/?category=${name}`}
        >
          #{name} {count}
        </CategoryItem>
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
