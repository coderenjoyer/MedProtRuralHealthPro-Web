"use client"

import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Sidebar from '../../Components/SpecialistComp/Sidebar';
import Appo from '../../Components/PatRegisComp/PatAppo';
import DentExam from '../../Components/SpecialistComp/DentExam';

const theme = {
  colors: {
    white: '#ffffff',
    grayLight: '#e5e7eb',
    grayDark: '#374151',
    gray: '#6b7280'
  },
  borderRadius: {
    md: '0.375rem',
    lg: '0.5rem'
  },
  shadows: {
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }
};

const SpecialistContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 2rem 2rem 0;
  background-color: #f5f7fb;
  transition: margin-left 0.5s ease;
  margin-left: ${props => props.$isCollapsed ? '70px' : '260px'};
  height: 100vh;
  overflow: hidden;
`;

const ExaminationView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  h1 {
    color: #4FC3F7;
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
`;

const Specialist = () => {
  const [activeView, setActiveView] = useState('examination');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'appointments':
        return <Appo />;
      case 'examination':
        return <DentExam />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SpecialistContainer>
        <Sidebar 
          selectedMenu={activeView} 
          setSelectedMenu={setActiveView}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <MainContent $isCollapsed={isCollapsed}>
          {renderContent()}
        </MainContent>
      </SpecialistContainer>
    </ThemeProvider>
  );
};

export default Specialist;

