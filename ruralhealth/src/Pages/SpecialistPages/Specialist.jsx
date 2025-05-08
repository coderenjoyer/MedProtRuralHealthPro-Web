"use client";

import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import GlobalStyle from "../../styles/specappglobal.js";
import theme from "../../styles/spec.theme.js";
import Sidebar from "../../Components/SpecialistComp/Sidebar.jsx";
import DentalExamination from "../../Components/SpecialistComp/DentExam.jsx";
import Appo from "../../Components/PatRegisComp/PatAppo";
import { AppContainer, MainContent } from "../../styles/specstyleapp.js";

function Specialist() {
  const [activeView, setActiveView] = useState("examination");
  const [isCollapsed, setIsCollapsed] = useState(false); // 🔼 shared collapse state

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <MainContent isCollapsed={isCollapsed}>
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
                <DentalExamination isCollapsed={isCollapsed} />
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
                <Appo isCollapsed={isCollapsed} />
              </motion.div>
            )}
          </AnimatePresence>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default Specialist;