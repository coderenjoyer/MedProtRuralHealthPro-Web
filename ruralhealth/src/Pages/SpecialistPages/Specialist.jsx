"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import GlobalStyle from "../../styles/specappglobal.js"
import theme from "../../styles/spec.theme.js"
import Sidebar from "../../Components/SpecialistComp/Sidebar.jsx"
import DentalExamination from "../../Components/SpecialistComp/DentExam.jsx"
import Appo from "../../Components/PatRegisComp/PatAppo"
import { AppContainer, MainContent } from "../../styles/specstyleapp.js"

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #105c7c;
  animation: spin 1s ease-in-out infinite;
  margin: 20px auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`;

function Specialist() {
  const [activeView, setActiveView] = useState("examination")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Validate user session
  useEffect(() => {
    const validateSession = () => {
      try {
        const user = localStorage.getItem("user")
        if (!user) {
          throw new Error('No active session found')
        }

        const userData = JSON.parse(user)
        if (userData.type !== "Specialist-Dentist") {
          throw new Error('Unauthorized access')
        }

        // Additional session validation logic here
        setLoading(false)
      } catch (error) {
        console.error('Session validation error:', error)
        setError(error.message)
        // Redirect to login after showing error
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    }

    validateSession()
  }, [navigate])

  const handleViewChange = (view) => {
    try {
      setActiveView(view)
    } catch (error) {
      console.error('Error changing view:', error)
      setError('Error changing view. Please try again.')
    }
  }

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading specialist dashboard...</p>
        </LoadingContainer>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ErrorMessage>
          {error}
          <p>Redirecting to login...</p>
        </ErrorMessage>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Sidebar setActiveView={handleViewChange} activeView={activeView} />
        <MainContent>
          <AnimatePresence mode="wait">
            {activeView === "examination" && (
              <motion.div
                key="examination"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  padding: "1rem",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <DentalExamination />
              </motion.div>
            )}
            {activeView === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  height: "100%",
                  overflow: "auto",
                  padding: "1rem",
                }}
              >
                <Appo />
              </motion.div>
            )}
          </AnimatePresence>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  )
}

export default Specialist

