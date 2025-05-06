import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../Components/DoctorComp/docsidebar";
import MainContentList from "../../Pages/DoctorPages/Maincontent";
import MainContentPatient from "../../Pages/DoctorPages/Maincontpatient";
import Appointments from "../../Components/PatRegisComp/PatAppo";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #e0f7fa;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 20px;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  margin-left: ${props => props.$isCollapsed ? '70px' : '260px'};
  width: calc(100% - ${props => props.$isCollapsed ? '70px' : '260px'});
  transition: all 0.5s ease;
`;

const PatientDiagnosisContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

const ListContainer = styled.div`
  width: ${props => props.$isPatientSelected ? '200px' : '400px'};
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
  transition: width 0.3s ease;
`;

const PatientContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  min-width: 500px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
`;

const animationSettings = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const EmptyStateText = styled.h2`
  color: #666;
  font-size: 1.2rem;
  text-align: center;
`;

const Doctor = () => {
  const [selectedButton, setSelectedButton] = useState("patientdiagnosis");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSidebarCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <Wrapper>
      <Sidebar 
        selectedButton={selectedButton} 
        setSelectedButton={setSelectedButton} 
        onCollapse={handleSidebarCollapse}
      />
      <ContentContainer $isCollapsed={isCollapsed}>
        <AnimatePresence mode="wait">
          {selectedButton === "patientdiagnosis" && (
            <motion.div
              key="patientdiagnosis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%' }}
            >
              <PatientDiagnosisContainer>
                <ListContainer $isPatientSelected={!!selectedPatient}>
                  <MainContentList onPatientSelect={handlePatientSelect} />
                </ListContainer>
                <PatientContainer>
                  {selectedPatient ? (
                    <MainContentPatient selectedPatient={selectedPatient} />
                  ) : (
                    <EmptyState>
                      <EmptyStateText>Select a patient to view details</EmptyStateText>
                    </EmptyState>
                  )}
                </PatientContainer>
              </PatientDiagnosisContainer>
            </motion.div>
          )}

          {selectedButton === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%' }}
            >
              <Appointments />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentContainer>
    </Wrapper>
  );
};

export default Doctor;