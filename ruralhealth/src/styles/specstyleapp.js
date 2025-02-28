import styled from "styled-components"

export const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

export const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`

