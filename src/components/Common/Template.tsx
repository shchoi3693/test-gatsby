import React, {
  createContext,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import styled from '@emotion/styled'
import GlobalStyle from './GlobalStyle'
import Footer from './Footer'
import { Helmet } from 'react-helmet'
import Search from './Search'

type TemplateProps = {
  title: string
  description: string
  url: string
  image: string
  children: ReactNode
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`

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

const Template: FunctionComponent<TemplateProps> = ({
  title,
  description,
  url,
  image,
  children,
}) => {
  return (
    <Container>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={title} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@me" />
        <meta name="twitter:creator" content="@me" />

        <html lang="ko" />
      </Helmet>

      <GlobalStyle />
      <Search />
      {children}
      <Footer />
    </Container>
  )
}

export default Template
