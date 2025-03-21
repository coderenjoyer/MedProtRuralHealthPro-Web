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
    background-color: #f5f7fb;
    color: black;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    color: black;
    margin-bottom: 1rem;
  }

  p {
    color: black;
    margin-bottom: 1rem;
  }

  a {
    color: black;
    text-decoration: none;
  }

  a:hover {
    color: black;
  }

  input, textarea, select {
    color: black;
    font-family: Arial, sans-serif;
  }

  button {
    color: black;
    font-family: Arial, sans-serif;
  }

  label {
    color: black;
  }

  ::placeholder {
    color: black;
    opacity: 0.7;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

export default GlobalStyle

