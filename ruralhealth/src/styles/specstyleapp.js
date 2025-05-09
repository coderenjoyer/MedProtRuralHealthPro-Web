import styled from "styled-components"

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
  color: black;
`

export const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f7fb;
  color: black;
  overflow-y: auto;
  margin-left: ${({ isCollapsed }) => (isCollapsed ? '70px' : '250px')};
  transition: margin-left 0.3s ease;
`