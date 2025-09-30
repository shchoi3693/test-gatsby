---
date: '2025-09-29'
title: 'Gatsby 검색기능'
categories: ['Gatsby', 'Fuse.js']
summary: 'Gatsby에 Fuse.js기능 넣기'
thumbnail: './gatsby-starter.jpg'
---

## [Fuse.js](https://www.fusejs.io/)
> Powerful, lightweight fuzzy-search library, with zero dependencies.  
> 주어진 쿼리와 정확히 일치하는 것이 아닌 주어진 패턴과 거의 동일한 문자열을 찾는 기술

## [gatsby-plugin-fusejs](https://www.gatsbyjs.com/plugins/gatsby-plugin-fusejs/)
> 빌드 시 인덱스 생성(gatsby-plugin-fusejs) &rightarrow; 생성한 인덱스를 런타임(React hook)에 fuse.js 사용

- fusejs node 생성 (index key)
```js:title=gatsby-config.js
module.exports = {
	plugins: [
    {
      resolve: `gatsby-plugin-fusejs`,
      options: {
        query: `
					{
						allMarkdownRemark {
							nodes {
								id
								fields { slug }
								rawMarkdownBody
								frontmatter {
									title
								}
							}
						}
					}
				`,
        keys: ['title', 'body'],
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map(node => ({
            id: node.id,
						slug: node.fields.slug,
            title: node.frontmatter.title,
            body: node.rawMarkdownBody,
          })),
      },
    },
	]
}
```

- Reuseing the search data
```tsx:title=app.tsx
export interface FuseItem {
  id: string
  title: string
  slug: string
}

export interface AppContextType {
  fusejs: FuseItem[] | null
  setFusejs: Dispatch<SetStateAction<FuseItem[] | null>>
}

export const AppContext = createContext<AppContextType>({
  fusejs: null,
  setFusejs: () => {},
})

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider: FunctionComponent<AppProviderProps> = ({
  children,
}) => {
  const [fusejs, setFusejs] = useState<FuseItem[] | null>(null)

  return (
    <AppContext.Provider value={{ fusejs, setFusejs }}>
      {children}
    </AppContext.Provider>
  )
}
```

```tsx:title=Search.tsx
import { graphql, Link, useStaticQuery } from 'gatsby'
import { useContext, useEffect, useRef, useState } from 'react'
import { useGatsbyPluginFusejs } from 'react-use-fusejs'
import { AppContext, FuseItem } from './Template'

type FuseDataQuery = {
  fusejs: {
    publicUrl: string
  }
}
type FuseResult<T> = {
  item: T
}

export function Search() {
  const data = useStaticQuery<FuseDataQuery>(graphql`
    {
      fusejs {
        publicUrl
      }
    }
  `)
  const [query, setQuery] = useState<string>('')
  const { fusejs, setFusejs } = useContext(AppContext)
  const result: FuseResult<FuseItem>[] = useGatsbyPluginFusejs(query, fusejs)
  const fetching = useRef<boolean>(false)

	// Lazy-loading the search data
  useEffect(() => {
    if (!fetching.current && !fusejs && query) {
      fetching.current = true

      fetch(data.fusejs.publicUrl)
        .then(res => res.json())
        .then((json: FuseItem[]) => setFusejs(json))
    }
  }, [fusejs, query])

  return (
    <SearchWrapper>
      <SearchInput
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <SearchResults>
        {result.map(({ item }: FuseResult<FuseItem>) => (
          <SearchResultItem key={item.id}>
            <Item to={item.slug}>{item.title}</Item>
          </SearchResultItem>
        ))}
      </SearchResults>
    </SearchWrapper>
  )
}

export default Search
```
- useStaticQuery  
	빌드 시 리액트 훅을 사용하여 GraphQL Data Layer 쿼리



* * *

