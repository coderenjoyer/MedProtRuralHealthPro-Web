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
  margin-left: 250px;
  transition: margin-left 0.3s ease;
`

export const ExaminationView = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: black;

  h1 {
    color: black;
    font-size: 24px;
    font-weight: 600;
  }
`

