import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    background-color: #f8fafc;
    color: #334155;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #1e293b;
    font-weight: 600;
  }

  button, input, select, textarea {
    font-family: inherit;
  }
`

export default GlobalStyle

