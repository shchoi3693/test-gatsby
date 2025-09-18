import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'

interface PostContentProps {
  html: string
}

const MarkdownRenderer = styled.div`
  width: 768px;
  margin: 0 auto;
  padding: 5.75rem 0;
  word-break: break-all;
  line-height: 1.5;
  font-size: 16px;
  font-weight: 400;

  h2 {
    font-weight: 600;
    margin-bottom: 1.625rem;
  }
  h3 {
    font-weight: 600;
    margin-bottom: 1rem;
  }
  * + h2 {
    margin-top: 7.5rem;
  }
  * + h3 {
    margin-top: 2rem;
  }
  hr + h1,
  hr + h2,
  hr + h3 {
    margin-top: 0;
  }
  h2 {
    font-size: 28px;
  }
  h3 {
    font-size: 20px;
  }
  p {
    padding: 4px 0;
  }

  blockquote {
    margin: 2rem 0;
    padding: 0.875rem 1.5rem;
    background-color: #f6f7fb;
    border-radius: 0.25rem;
  }

  ol,
  ul {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
  }
  li {
    margin: 0.75rem 0;
  }
  ul li::marker {
    color: #c4c9dd;
  }
  .contains-task-list {
    list-style: none;
  }

  table {
    margin: 1rem 0;
    border-collapse: collapse;
    border: 1px solid #ebeef7;
  }
  table thead tr {
    border-bottom: 2px solid #ebeef7;
    background-color: #ebeef7;
  }
  table tr:not(:last-of-type) {
    border-bottom: 1px solid #ebeef7;
  }
  table th {
    min-width: 60px;
    padding: 0.625rem 1.5rem 0.375rem;
  }
  table td {
    padding: 0.625rem 1.5rem;
  }

  hr {
    border: 1px solid #ebeef7;
    margin: 6.25rem 0;
  }

  a {
    color: #5369ad;
    text-decoration: underline;
    &:hover {
      color: #2b3d74;
    }
  }

  code[class*='language-'],
  pre[class*='language-'] {
    tab-size: 2;
    font-size: 14px;
    border-radius: 0.25rem;
  }
  *:not(pre) > code[class*='language-'] {
    padding: 0.2rem 0.375rem;
  }

  .gatsby-highlight {
    position: relative;
  }
  .gatsby-highlight:after {
    position: absolute;
    padding: 0 4px;
    right: 6px;
    top: 6px;
    border-radius: 2px;
    border: 1px solid #ccc;
    color: #ccc;
    font-size: 10px;
  }
  .gatsby-highlight[data-language='markdown']:after {
    content: 'Markdown';
  }
  .gatsby-highlight[data-language='html']:after {
    content: 'HTML';
  }
  .gatsby-highlight[data-language='tsx']:after {
    content: 'tsx';
  }
  .gatsby-highlight[data-language='css']:after {
    content: 'CSS';
  }
  .gatsby-highlight[data-language='javascript']:after {
    content: 'Javscript';
  }
  .gatsby-highlight[data-language='js']:after {
    content: 'JS';
  }
  .gatsby-highlight[data-language='json']:after {
    content: 'JSON';
  }

  .gatsby-code-title {
    margin-bottom: -0.6rem;
    padding: 0.5em 1rem;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    background-color: #2d2d2d;
    border-bottom: 6px solid #222;
    color: #ccc;
    z-index: 0;
    font-size: 13px;
    border-top-left-radius: 0.3em;
    border-top-right-radius: 0.3em;
  }
`

const PostContent: FunctionComponent<PostContentProps> = ({ html }) => {
  return <MarkdownRenderer dangerouslySetInnerHTML={{ __html: html }} />
}

export default PostContent
