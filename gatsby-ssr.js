/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

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
