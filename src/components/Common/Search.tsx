import { graphql, Link, useStaticQuery } from 'gatsby'
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useGatsbyPluginFusejs } from 'react-use-fusejs'
import { AppContext, FuseItem } from './Template'
import styled from '@emotion/styled'

type FuseDataQuery = {
  fusejs: {
    publicUrl: string
  }
}
type FuseResult<T> = {
  item: T
}

const SearchWrapper = styled.form`
  position: absolute;
  right: 16px;
  top: 16px;
  display: block;
  width: 180px;
  z-index: 100;
`
const SearchInputWrapper = styled.div`
  position: relative;
`
const SearchIcon = styled.i`
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none'%3E%3Cpath stroke='%23686868' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8.25 14.25a6 6 0 1 0 0-12 6 6 0 0 0 0 12M15.75 15.75l-3.262-3.262'/%3E%3C/svg%3E")
    50% 50%;
`
const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 0px 32px;
  border: 1px solid #ebebeb;
  background: #fff;
  border-radius: 30px;
  line-height: 30px;

  &:focus,
  &:active {
    border-color: #195177;
    box-shadow: 0 0 0 2px #4a88b1;
    transition: 0.3s;
  }
`
const SearchInputReset = styled.button`
  position: absolute;
  right: 4px;
  top: 0;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin: auto 0;
  border: 0;
`
const SearchResults = styled.ul`
  position: absolute;
  right: 0;
  margin-top: 6px;
  min-width: 200px;
  padding: 8px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #ddd;
  list-style-type: none;
`
const SearchResultItem = styled.li`
  margin: 0;
`
const Item = styled(Link)`
  display: block;
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 3px;
  &:hover {
    color: #195177;
    background-color: #e9f2f7;
  }
`

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
  const [isReset, setIsReset] = useState<boolean>(false)

  useEffect(() => {
    if (!fetching.current && !fusejs && query) {
      fetching.current = true

      fetch(data.fusejs.publicUrl)
        .then(res => res.json())
        .then((json: FuseItem[]) => setFusejs(json))
    }
  }, [fusejs, query])

  const searchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (e.target.value !== '') {
      setIsReset(true)
    } else {
      setIsReset(false)
    }
  }
  const resetHandler = () => {
    setQuery('')
    setIsReset(false)
  }

  return (
    <SearchWrapper>
      <SearchInputWrapper>
        <SearchIcon />
        <SearchInput type="text" value={query} onChange={searchInputHandler} />
        {isReset && (
          <SearchInputReset type="reset" title="지우기" onClick={resetHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 8 L8 16"
                stroke="#686868"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 8L16 16"
                stroke="#686868"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SearchInputReset>
        )}
      </SearchInputWrapper>
      {result?.length > 0 && (
        <SearchResults>
          {result.map(({ item }: FuseResult<FuseItem>) => (
            <SearchResultItem key={item.id}>
              <Item to={item.slug}>{item.title}</Item>
            </SearchResultItem>
          ))}
        </SearchResults>
      )}
    </SearchWrapper>
  )
}

export default Search
