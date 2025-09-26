---
date: '2025-09-22'
title: 'Gatsby 페이지 구현하기'
categories: ['Gatsby', 'React']
summary: 'Gatsby 페이지 구현하며 React 익히기'
thumbnail: './gatsby-starter.jpg'
---

## query-string
> URL의 Query String(search parameters) 객체로 변환

- URL Query String : 엔드포인트 주소 이후 ?parameter=value
- 여러개일 경우 `&` : \~/?key=value&key=value
```tsx
import queryString, { ParsedQuery } from 'query-string'

const somePage: FunctionComponent<~Props> = function(){
	const parsed: ParsedQuery<string> = queryString.parse(location.search)
	const selected: string =
		typeof parsed.someCategory !== 'string' || !parsed.someCategory
			? 'All' 
			: parsed.someCategory

	return <div />
}
```
- location.search : [Gatsby page 컴포넌트]의 기본 props(ex location.pathname, location.hash...)

## List Paint
> `Array.prototype.reduce()`, `Array.prototype.filter()` 메서드 사용
```javascript
array.reduce((accumulator, current)=>{
	...
	return accumulator;
}, {initialValue})
```
```javascript
array.filter((sort) => result)
// array 반환
// true : 배열에 요소 유지 | false : 배열에 요소 제거
```

```tsx
const somePage: FunctionComponent<~Props> = function(){
	const listTabs = useMemo(()=>
		data.reduce((list, {node:{ frontmatter: { querys }}}) =>{
			querys.forEach((query)=>{
				query in list ? list[query]++ : (list[query] = 1)
			})
			list['All']++
			return list
		},{ All: 0 })
	,[])

	const data = useMemo(() => (
			items.filter({node:{someCategory}}) =>
				selected === 'All' ? true : someCategory.includes(selected)

		), [selected]
	)

	return (
		<Template>
			<Tabs listTabs={listTabs} />
			<ListWrapper ref={}> // Infinity Scroll
				{data.map(
					({node:{props, slug}}) => <Item {...props} link={slug} />
				)}
			</ListWrapper>
		</Template>
	)
}
```

## Infinity Scroll
- List와 hook 참조 시킨 후 원하는 갯수 만큼 props의 데이터 잘라내 반환  
	List: `<ListWrapper ref={containerRef}>`  
	원하는 갯수: `const [count, setCount] = useState<number>(1)`

```tsx:title=List.tsx
const List: FunctionComponent<ListProps> =({ propsData }) =>{
	const { containerRef, itemsList } = hook( propsData )
	return(
		<ListWrapper ref={containerRef}>
			{itemsList.map(
				({node:{props, slug}}) => (
					<Item {...props} link={slug} />
				)
			)}
		</ListWrapper>
	)
}
```

```tsx:title=hook.tsx
const hook = ({ propsData }) => {
	const containerRef = MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null)
	const observer: MutableRefObject<IntersectionObserver | null> = useRef<IntersectionObserver>(null)
	const [count, setCount] = useState<number>(1)

	const itemsData = [...propsData] // propsData 필터 하기(propsData.filter((selected) => true array)

	useEffect(()=>{
		observer.current = new IntersectionObserver((entries, observer) =>{
				if (!entries[0].isIntersecting) return
				setCount(val => val + 1)
				observer.unobserve(entries[0].target)
			},
			{ threshold:1 },
		)
	}, [])

	useEffect(() =>{
		if(데이터 없을 시, 데이터 적을 시 ||
			containerRef.current === null ||
			containerRef.current.children.length === 0
		)
			return
		
		// 감지 할 object : 제일 마지막 children
		observer.current.observe(
			containerRef.current.children[containerRef.current.children.length - 1]
		)
	}, [count])

	return{
		containerRef,
		itemsList: itemsData.slice(0, count);
	}
}
```

## onCreateNode (Gatsby API)
> MarkdownRemark 데이터에 Slug 필드 생성하기

### Slug
- 특정 페이지의 제목을 핵심 키워드 조합으로 식별하기 위해 만드는 방법
- URL 경로에 사용 (SEO 친화적)

- [gatsby-source-filesystem](/gatsby-starter/#gatsby에서-markdown-파일-사용하기) 라이브러리를 통해 root(`${__dirname}`)/contents/ 내의 모든 마크다운 파일들마다 파일위치,파일 명으로 Slug 생성
```js:title=gatsby-node.js
const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions
	if (node.internal.type === `MarkdownRemark`) {
		const slug = createFilePath({ node, getNode })
		createNodeField({ node, name: 'slug', value: slug })
	}
}
```

## createPages (Gatsby API)
> 생성한 Slug로 페이지 생성하기

1. 마크다운 데이터의 모든 slug 조회 (graphql), 날짜 제목 내림차순(sort)
2. 조회 한 slug의 데이터 생성(queryAllMarkdownData), 없을 시 에러 (reporter.panicOnBuild: 개발 시 서버 실행, 빌드 시 중단)
3. 생성 한 데이터(queryAllMarkdownData)를 통해 페이지 생성  
	`~~Data.forEach(({node:{ fields: { slug } }}) => ...createPage(pageOptions))` : `generatePage`
4. 페이지의 옵션 (객체 형식 : pageOptions)
	- path - slug 데이터 그대로 사용(url)
	- component - path 라이브러리를 통해 불러온 템플릿
	- context: { slug } - 이 데이터(slug 객체)는 템플릿 컴포넌트(`src/templates/some_template.tsx`)에서 **Props**로 받을 수 있으며 **GraphQL Query 파라미터**로 받을 수 있다.

```tsx:title=src/templates/some_template.tsx
import React, { FunctionComponent } from 'react'

const someTemplate: FunctionComponent<~Props> = function (props) {
  console.log(props)

  return <div></div>
}

export default someTemplate
```
```js:title=gatsby-node.js
const path = require('path')

exports.createPages = async ({ actions, graphql, reporter }) => {
	const { createPage } = actions

	const queryAllMarkdownData = await graphql(
		`
			{
				allMarkdownRemark(
					sort: {
						order: DESC
						fields: [frontmatter___date, frontmatter___title]
					}
				) {
					edges {
						node {
							fields {
								slug
							}
						}
					}
				}
			}
		`,
	)

	// Handling GraphQL Query Error
	if (queryAllMarkdownData.errors) {
		reporter.panicOnBuild(`Error While running query`)
		return
	}

	// Import Post Template Component
	const PostTemplateComponent = path.resolve(
		__dirname,
		`src/templates/some_template.tsx`,
	)

	// Page Generating Function
	const generatePage = ({
		node: {
			fields: { slug },
		},
	}) => {
		const pageOptions = {
			path: slug,
			component: PostTemplateComponent,
			context: { slug },
		}
		createPage(pageOptions)
	}
	// Generate Post Page And Passing Slug Props for Query
	queryAllMarkdownData.data.allMarkdownRemark.edges.forEach(generatePage)
}
```

## 템플릿 컴포넌트 데이터 조회하기
### GraphQL Query 파라미터 Template에서 받기
- query내에서 파라미터 사용 시 필드와 구분하기 위해 `$` 접두사 붙인 후 타입 명시(타입 명 - 대문자 시작)
- context 데이터 객체 내의 Props와 동일한 key 값으로 설정
- `eq:`(equal) property로 slug와 일치하는 마크다운 데이터만 query
```tsx:title=src/templates/some_template.tsx
...
query queryMarkdownDataBySlug($slug: String){
	allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {edges{node...}}
}
```

## Markdown 문서 HTML 출력
> __html key에 HTML 태그로 변환되어 문자열로 저장 (frontmatter 제외)
```tsx
interface ContentProps{
	html: string
}
const Content: FunctionComponent<ContentProps> = ({html}) =>{
	return <Some dangerouslySetInnerHTML={{_html: html}}>
}
```

## Meta Tag

### React-Helmet
```
yarn add @types/react-helmet
```
- 중복된 경우 나중에 정의된 태그 적용
```tsx
import { Helmet } from 'react-helmet'

const Template: FunctionComponent<TemplateProps> = function({
	title,
	descriptions,
	url,
	...
}){
	return(
		<Wrapper>
			<Helmet>
				<title>WebSite</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={image} />
				<meta property="og:url" content={url} />
				<meta property="og:site_name" content={title} />				
			</Helmet>
			...
		</Wrapper>
	)
}
```
### GraphQL로 각 페이지 Helmet에 데이터 전달

```js:title=gatsby-config.js
module.exports = {
  siteMetadata: {
    title: `Gatsby Test Site`,
    description: `블로그 입니다.`,
    author: `@Mee`,
    siteUrl: `~/test-gatsby/`,
  },
}
```

#### Main
```tsx:title=index.tsx
type IndexProps = {
	...
	data: {
		site: {
			shiteMetadata: {
				title: string
				description: string
				siteUrl: string
			}
		}
	}
	...
	file: {
		publicURL: string
	}
}

const Index: FunctionComponent<IndexProps> = function({
	data: {
		site: {
			siteMetadata: {title, description, siteUrl}
		}
	}
}) {
	return (
		<Template
			title={title}
      description={description}
      url={siteUrl}
      image={publicURL}
		/>
	)
}

export const getIndex = graphql`
	query getIndex {
		site{
			siteMetadata{
				title
				description
				siteUrl
			}
		}
	}
`
```
- publicURL(static 경로) : 원본 파일 그대로 가져올 때 사용

#### Sub
```tsx:title=template.tsx
type TemplateProps = {
	...
	location: {
		href: string
	}
}

const Template: FunctionComponent<TemplateProps> = function({
	...
	location: { href },
}) {

	return (
		<Template
			title={title}
      description={summary}
      url={href}
      image={publicURL}
		/>
	)
}

export const queryMarkdown = graphql`
	query queryMarkdown($slug: String) {
		allMarkdownRemark(sort){
			edges {
				node{ ... }
			}
		}
	}
`
```

## Canonical Link
> 중복된 페이지 중 표준으로 사용되는 URL이 무엇인지 검색 엔진에 알려주는 메타 태그

- 검색 엔진 임의로 표준 지정 방지
- 중복 콘텐츠로 SEO 분산 방지
- 크롤링 효율성 향상

### 중복된 페이지 발생 이유
- 디바이스 별 구분된 웹사이트(적응형)
- url 쿼리 스트링 사용

```html
<head>
	<link rel="canonical" href="https://www.~.com" />
</head>
```
- 절대경로로 작성
- 태그 중첩하지 않도록 작성

### Gatsby Canonical 라이브러리
```
yarn add gatsby-plugin-canonical-urls
```
```js:title=gatsby-config.js
module.exports = {
	plugins: [
		{
			resolve: `gatsby-plugin-canonical-urls`,
			options: {
				siteUrl: `https://www.~.com`,
				stripQueryString: true,
			},
		},
	],
};
```
- stripQueryString : 쿼리 스트링 제거 옵션

## Sitemap
```
yarn add gatsby-plugin-sitemap
```
```js:title=gatsby-config.js
module.exports = {
	plugins: [
		'gatsby-plugin-sitemap',
	],
};
```
- sitemap-0.xml, sitemap-1.xml (특정 갯수 이상 일 경우 sitemap 인식 못하는 문제 해결)

## robots.txt
```
yarn add gatsby-plugin-robots-txt
```
```js:title=gatsby-config.js
module.exports = {
	plugins: [
		{
			resolve: 'gatsby-plugin-robots-txt',
			options: {
				policy: [{ userAgent: '*', allow: '/' }],
			},
		},
	],
};
```

* * *
- React 기반 Gatsby로 기술 블로그 개발하기  
  <https://www.inflearn.com/course/gatsby-기술블로그/dashboard>

- [표준 URL을 지정 하는 방법](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=ko&visit_id=638652447901198736-2506116594&rd=1#rel-canonical-link-method)