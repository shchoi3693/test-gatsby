---
date: '2025-09-17'
title: 'Gatsby 시작하기'
categories: ['Gatsby', 'Markdown', 'GraphQL', 'TypeScript', 'EmotionJS']
summary: 'Gatsby 환경 구성하기'
thumbnail: './gatsby-starter.jpg'
---

## 특징

> React, GraphQL 기반 <u>정적 페이지 (Static Site Generator)</u> 생성  
> JAM Stack (Javascript, API, MarkUp Stack) 기반 프레임워크 - 빠르고 안전하고 스케일링 하기 쉬움

- 서버와 통신, 동적 생성(Next.js)과 달리 서버 없이 정적 사이트 생성
- 빌드 시 각 페이지에 대한 파일 생성, 저장(CDN) 후 요청 시 재사용
- CDN(Content Delivery Network) 통해 제공
- 기업 소개 페이지, 블로그, 포트폴리오 작업에 적합
- 다양한 [플러그인](https://www.gatsbyjs.com/plugins#cms) 사용하여 쉽게 제작 가능

## Gatsby 프로젝트 생성

```
npx gatsby-cli new "NEW PROJECT"
```

### Directory
- contents: 포스트 관련 파일 (markdown, img)
- src
	- components: React Components
	- hooks
	- pages: 파일 명으로 페이지 접근가능
	- templates: 여러 콘텐츠 Components, Gatsby에서 제공하는 API로 페이지 생성  
		파일명으로 접근 불가
- static: 정적 파일

### Gatsby Rendering
gatsby-browser.js|gatsby-ssr.js
:---|:---
브라우저(클라이언트) | 서버
페이지 로드 후 | HTML 생성 시
전역 CSS Import, 이벤트 제어, 브라우저 전용 API 사용 시 | mata/script/style preload(폰트)

- 구글 태그 관리자
```js:title=gatsby-ssr.js
/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
const { gtmNoscript, gtmScript } = require('./src/components/Common/gtm-tag')

exports.onRenderBody = ({
  setHtmlAttributes,
  setHeadComponents,
  setPreBodyComponents,
}) => {
  setHtmlAttributes({ lang: `en` })
  setHeadComponents([gtmScript])
  setPreBodyComponents([gtmNoscript])
}
```

## TypeScript

> MicroSoft에서 개발, 오픈 소스 프로그래밍 언어  
> Javascript에 타입을 부여한 언어 (Javascript로 컴파일 되어 동작)

- 컴파일 단계에서 에러를 알려주어 오류 방지
- 변수와 함수의 타입을 알 수 있어 유지보수 용이

```
yarn add typescript --dev gatsby-plugin-typescript
```
```js:title=gatsby-config.js
module.exports = {
	plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    ...
  ],
}
```

```
yarn tsc --init
```
```json:title=tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "allowJs": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "baseUrl": "./src",
    "paths": {
      "components/*": ["./components/*"],
      "utils/*": ["./utils/*"],
      "hooks/*": ["./hooks/*"]
    },
    "strict": true,
    "jsx": "preserve",
    "jsxImportSource": "@emotion/react",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

```js:title=gatsby-node.js
/**
 * @type {import('gatsby').GatsbyNode['createPages']}
*/
const path = require('path')

// Setup Import Alias
exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const output = getConfig().output || {}

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        utils: path.resolve(__dirname, 'src/utils'),
        hooks: path.resolve(__dirname, 'src/hooks'),
      },
    },
  })
}
```

### 함수형 컴포넌트
```tsx
import {FunctionComponent} from 'react'

const SomePage: FunctionComponent = function(){
	return <Text />
}
export default SomePage
```

### Generic

클래스나 함수에서 사용할 타입을 미리 명시 후 사용할 때 결정

```tsx
import {FunctionComponent} from 'react'

interface SomeProps {
	text: string
}

const SomePage: FunctionComponent<SomeProps> = function(){
	return <Text />
}
export default SomePage
```

### interface 와 type 차이
- `interface`
	- 객체 타입 정의 시(공개 API) 사용
	- extends 확장 가능

```tsx
interface SomeProps {
	title: string
}
interface SomeProps {  // 선언적 확장도 가능
	body: string
}
interface SomeProps2 extends SomeProps {
	SomeBody: string
}
const MyContents: SomeProps2 = {
	title: '...',
	body: '...',
	SomeBody: '...',
}
```

- `type`
	- 병합 불가
	- 확장 시 `&` 연산자 사용
	- computed value 사용 가능

```tsx
type SomeProps{
	title: string
} & {
	body: string
}

type SomeArray = {
	[key in Somes]: string
}
```

## EmotionJS

> styled-components 의 기능과 거의 동일하며 번들 용량이 작다

```
yarn add gatsby-plugin-emotion @emotion/react @emotion/styled
```
```js:title=gatsby-config.js
module.exports = {
	plugins: [
		...
    `gatsby-plugin-emotion`,
    ...
  ],
}
```

### Global 스타일 지정 방법
```tsx
import { Global, css } from '@emotion/react'
const defaultStyle = css`
  body {
    margin: 0;
    padding: 0;
    font-family: Pretendard, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: #333;
  }
`
const GlobalStyle: FunctionComponent = function () {
  return <Global styles={defaultStyle} />
}
export default GlobalStyle
```

### css 정의 및 적용
```tsx
import { css } from '@emotion/react'
const SomeStyle = css`
	font-size:14px;
`
...
<div css={SomeStyle}></div>
...
```

### Styled Component 생성 1 : .(dot)을 통해 함수 호출
Kebab Case
```tsx
import { styled } from '@emotion/react'
const SomeStyledComponent = styled.div`
	font-size:14px;
`
<SomeStyledComponent></SomeStyledComponent>
```

### Styled Component 생성 2 : 객체
Camel Case, 스타일 값은 String Type으로 전달
```tsx
import { styled } from '@emotion/react'
const SomeComponent = styled('div')(() =>({
	fontSize: '14px'
}))
<SomeComponent></SomeComponent>
```

### Styled Component에서 Props

```tsx
const SomeStyledComponent = styled.div<{ disable: boolean }>`
	text-decoration: ${({ disable })=>( disable ? `line-through` : `none`)}
`
```
```tsx
const SomeComponent = styled('div')<{ disable: boolean}>(({ disable })=>({
	textDecoration: disable ? `line-through` : `none`,
}))
```
```tsx
const Component = styled(({ active, ...props }: Props타입명시) =>(
	<Link {...props} />
)) <Some타입명시>`
	font-size: 14px;
`
```

## Gatsby에서 [Markdown](/markdown-syntax) 파일 사용하기

### Remark
> Markdown을 처리하기 위한 자바스크립트 기반 파서

- 변환된 추상 구문 트리(AST, Abstract syntax tree)를 이용하여 다른 플러그인으로 확장
- 변환된 AST를 HTML로 변환하여 컴포넌트 출력

> [Markdown] &rightarrow; Remark &rightarrow; AST(mdast) &rightarrow; AST 노드에 플러그인 접근(수정, 추가, 삭제) &rightarrow;  
> [GraphQL 스키마](#graphql) 생성, 매핑 &rightarrow; [HTML], React 컴포넌트

### Markdown 라이브러리
- gatsby-source-filesystem  
	: 변환할 파일 정보 제공 (다른 라이브러리와 연계(~-transformer, ~-images), GraphQL 연결)
- gatsby-transformer-remark  
	: HTML로 변환
- gatsby-remark-images     
	: 이미지 최적화 (반응형, loading lazy)
- gatsby-remark-prismjs & prismjs  
	: code 하이라이팅
- gatsby-remark-smartypants  
	: 문장부호 타이포그래피 가독성 좋게 자동 변환 (ex quotes ' " , ... ---)
- gatsby-remark-autolink-headers  
	: header 바로가기 링크
- gatsby-remark-copy-linked-files  
	: 사용되는 파일 static 경로로 복사 > 빌드 후에도 링크 유효
- gatsby-remark-external-links  
	: 사용되는 링크 태그 속성 지정 (target, rel)
- gatsby-omni-font-loader  
	: web font

```
yarn add gatsby-transformer-remark gatsby-remark-images gatsby-remark-prismjs prismjs gatsby-remark-smartypants gatsby-remark-copy-linked-files gatsby-remark-external-links
```

```js:title=gatsby-config.js
module.exports = {
	...
	plugins: [
		{
			resolve: `gatsby-plugin-typescript`,
			options: {
				isTSX: true,
				allExtensions: true,
			},
		},
		`gatsby-plugin-emotion`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `contents`,
				path: `${__dirname}/contents`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/static`,
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-omni-font-loader`,
			options: {
				enableListener: true,
				preconnect: [`https://cdn.jsdelivr.net/gh/orioncactus/pretendard`],
				web: [
					{
						name: `Pretendard`,
						file: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css`,
					},
				],
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-smartypants`,
						options: {
							dashes: `oldschool`,
						},
					},
					{
						resolve: `gatsby-remark-autolink-headers`,
						options: {
							className: `link-headers`,
							elements: [`h2`],
						},
					},
					`gatsby-remark-code-titles`,
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							classPrefix: `language-`,
						},
					},
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 768,
							quality: 100,
							withWebp: true,
						},
					},
					{
						resolve: `gatsby-remark-copy-linked-files`,
						options: {},
					},
					{
						resolve: `gatsby-remark-external-links`,
						options: { target: `_blank`, rel: `nofollow` },
					},
				],
			},
		},
		...
	],
}
```

code 테마 적용
```js:title=gatsby-browser.js
import 'prismjs/themes/prism-tomorrow.css';
```

## GraphQL

> 페이스북 쿼리언어  
> 클라이언트가 요청한 데이터(필요한 데이터)만 가져온다

### Gatsby에서 GraphQL 사용하기

#### GraphiQL (IDE)
```
View GraphiQL, an in-browser IDE, to explore your site's data and schema

	http://localhost:8000/___graphql 
```

- 홈페이지의 메타데이터, 마크다운 데이터, 이미지 데이터를 Query하여 얻을 수 있다.
- 직접 생성한 페이지(src/pages/) 또는 Gatsby가 제공한 페이지(Node API `createPages`)에서 Query 정의 가능하다.

> GraphQL 스키마(Query 정의) &rightarrow; Query export(질의) &rightarrow; Gatsby 요청/응답 &rightarrow; 데이터를 Props(키 값 data)로 전달

- GraphQL 스키마 (데이터 구성 방식) : 데이터 사용 전 타입 정의

```tsx
import { graphql } from 'gatsby'
type SomeContentProps = {  // GraphQL 스키마 정의
	data: {
		someQuery:{
			some: string
		}
	}
}
const SomeContent: FunctionComponent<SomeContentProps> = function({
	// 데이터 (결과)
	data: {
		someQuery: {
			some
		}
	}
}) {
	return(
		<div> {some} </div>
	)
}
export default SomeContent

export const someQuery = graphql`  // Query export(질의)
	query someQuery { // 디버깅 시 로그에서 쿼리 이름(someQuery) 확인 가능
		{
			some{}
		}
	}
`
```

### Markdown 파일에서 GraphQL (gatsby-transformer-remark 라이브러리)
- MarkdownRemark : 파일 1개
- allMarkdownRemark : 파일 여러개
- file : 이미지, 파일
- edges : 연결 (배열)
- node : 개별 실제 데이터
- frontmatter : 상단 메타데이터

```tsx
import { graphql } from 'gatsby'
type SomePageProps = {
	data:{
		allMarkdownRemark:{
			edges: {node:{id...}}
		}
		file:{
			childrenImagesharp: string
		}
	}
}
const SomePage: FunctionComponent<SomePageProps> = function({
	data: {
		allMarkdownRemark: {edges},
		file:{
			childrenImageSharp: {gatsbyImageData},
		}
	}
}) {

	return (<div />)
}
export default SomePage

export const SomeQuery = graphql`
	query SomeQuery {
		allMarkdownRemark(sort){
			edges{
				node{
					id
					frontmatter{ title summary....}
				}
			}
		}
		file(name: {} ){
			childImageSharp{
				gatsbyImageData(width:..., height:,,,)
			}
		}
	}
`
```

## Gatsby Link API
- 경로를 to(props)로 전달
- 페이지의 Link 모두 찾은 후 모든 페이지(to="경로") Prefetch > 로딩 속도 빠름

* * *
- React 기반 Gatsby로 기술 블로그 개발하기

  <https://www.inflearn.com/course/gatsby-기술블로그/dashboard>