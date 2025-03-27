import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Appo from '../PatRegisComp/PatAppo';
import DentalExamination from './DentExam';

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

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const Specialist = () => {
  const [activeView, setActiveView] = useState('examination');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate activeView value
  useEffect(() => {
    const validViews = ['examination', 'appointments'];
    if (!validViews.includes(activeView)) {
      console.error('Invalid view:', activeView);
      setError('Invalid view selected. Defaulting to examination view.');
      setActiveView('examination');
    }
  }, [activeView]);

  const handleViewChange = (view) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!view || typeof view !== 'string') {
        throw new Error('Invalid view parameter');
      }

      const validViews = ['examination', 'appointments'];
      if (!validViews.includes(view)) {
        throw new Error('Invalid view selected');
      }

      setActiveView(view);
    } catch (error) {
      console.error('Error changing view:', error);
      setError(error.message || 'Error changing view');
      setActiveView('examination'); // Fallback to examination view
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    try {
      switch (activeView) {
        case 'appointments':
          return <Appo />;
        case 'examination':
          return (
            <ExaminationView>
              <h1>Dental Examination</h1>
              <DentalExamination />
            </ExaminationView>
          );
        default:
          throw new Error('Invalid view selected');
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      setError('Error loading content. Please try again.');
      return (
        <ErrorMessage>
          Error loading content. Please try refreshing the page.
        </ErrorMessage>
      );
    }
  };

  return (
    <SpecialistContainer>
      <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      <MainContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isLoading && <LoadingMessage>Loading...</LoadingMessage>}
        {renderContent()}
      </MainContent>
    </SpecialistContainer>
  );
};

export default Specialist; 