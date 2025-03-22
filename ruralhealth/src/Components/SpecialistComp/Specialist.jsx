import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Appo from '../PatRegisComp/PatAppo';

const SpecialistContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #f5f7fb;
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

  const renderContent = () => {
    switch (activeView) {
      case 'appointments':
        return <Appo />;
      case 'examination':
        return (
          <ExaminationView>
            <h1>Dental Examination</h1>
            {/* Add your examination content here */}
          </ExaminationView>
        );
      default:
        return null;
    }
  };

  return (
    <SpecialistContainer>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <MainContent>
        {renderContent()}
      </MainContent>
    </SpecialistContainer>
  );
};

export default Specialist; 