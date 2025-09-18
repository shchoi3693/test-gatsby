---
date: '2025-09-17'
title: 'Gatsby 시작하기'
categories: ['Gatsby', 'EmotionJS']
summary: 'Gatsby 개츠비 시작하기'
thumbnail: './gatsby-starter.jpg'
---

## 특징

> JAM Stack (Javascript, API, MarkUp Stack) 기반 프레임워크 - 빠르고 안전하고 스케일링 하기 쉬움  
> React, GraphQL 기반 <u>정적 페이지 (Static Site Generator)</u> 생성

- 서버와 통신, 동적 생성(Next.js)과 달리 서버 없이 정적 사이트 생성
- 빌드 시 각 페이지에 대한 파일 생성
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

> 타입 안전성을 위해 명시

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
    "jsx": "react-jsx",
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

`interface` 와 `type` 차이

- `interface` 확장(extends) 가능 : 객체 중심(공개 API)

```tsx
interface SomeProps {
	title: string
}
interface SomeProps {
	body: string
}
```

- `type` 병합 불가, & 연산자 사용 : 일반적으로 사용

```tsx
type SomeProps{
	title: string
} & {
	body: string
}
```

## GraphQL

> 페이스북 쿼리언어  
> 클라이언트가 요청한 데이터만 가져온다

### GraphiQL (IDE)
```
View GraphiQL, an in-browser IDE, to explore your site's data and schema

  http://localhost:8000/___graphql 
```

### Gatsby에서 사용하기

- 홈페이지의 메타데이터, 마크다운 데이터, 이미지 데이터를 Query를 통해 얻을 수 있다.
- pages/ 내부 파일과 Gatsby API 페이지 템플릿 파일에서만 Query 정의 가능하다.

```tsx
import { graphql } from 'gatsby'
type SomeContentProps = {
	data: {
		some: string
	}
}
const SomeContent: FunctionComponent<SomeContentProps> = function({
	data: {
		some
	}
}) {
	return(
		<div> {some} </div>
	)
}
export default SomeContent

export const someQuery = graphql`
	{
		some{}
	}
`
```
> Query 변수 담기 > export > Gatsby 요청/응답 > Props(키 값 data)로 전달

## Gatsby Link API
- 경로를 to(props)로 전달
- 페이지의 Link 모두 찾은 후 모든 페이지(to="경로") Prefetch > 로딩 속도 빠름

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
V5 설정
```json:title=tsconfig.json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "@emotion/react",
	}
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

## Markdown 라이브러리
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

* * *
- React 기반 Gatsby로 기술 블로그 개발하기

  <https://www.inflearn.com/course/gatsby-기술블로그/dashboard>