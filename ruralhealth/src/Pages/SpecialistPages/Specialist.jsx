"use client"

import { useState } from "react"
import { ThemeProvider } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import GlobalStyle from "../../styles/specappglobal.js"
import theme from "../../styles/spec.theme.js"
import Sidebar from "../../Components/SpecialistComp/Sidebar.jsx"
import DentalExamination from "../../Components/SpecialistComp/DentExam.jsx"
import PatientRegistry from "../../Components/SpecialistComp/PatientReg.jsx"
import { AppContainer, MainContent } from "../../styles/specstyleapp.js"


function App() {
  const [activeView, setActiveView] = useState("examination")

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Sidebar setActiveView={setActiveView} activeView={activeView} />
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
                  display: "flex",
                  gap: "20px",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <DentalExamination />
                <PatientRegistry />
              </motion.div>
            )}
            {activeView === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%" }}
              >
                <h2>Appointments</h2>
                <p>Appointment calendar and scheduling tools will be displayed here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App

