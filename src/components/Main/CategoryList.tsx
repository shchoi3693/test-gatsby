import styled from '@emotion/styled'
import { Link } from 'gatsby'
import React, { FunctionComponent, ReactNode } from 'react'

export type CategoryListProps = {
  selectedCategory: string
  categoryList: { [key: string]: number }
}

const CategoryListWrapper = styled.div`
  display: flex;
  max-width: 660px;
  flex-wrap: wrap;
  margin: 100px auto 0;
  gap: 8px;
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
  padding: 6px 12px;
  border-radius: 3px;
  color: #646464;
  border: 1px solid #e0e9ef;
  ${({ active }) =>
    active ? 'border-color: #195177; color: #0f2f44; font-weight:700; ' : ''};
  font-size: 16px;
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
          {name} {count}
        </CategoryItem>
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
