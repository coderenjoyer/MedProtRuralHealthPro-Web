"use client"

import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from "framer-motion";
import { ref, onValue, push, update } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import Sidebar from '../../Components/SpecialistComp/Sidebar';
import Appo from '../../Components/PatRegisComp/PatAppo';

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
  overflow-y: auto;
  min-width: 400px;
`;

const Container = styled(motion.div)`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 100vh;
  padding: 2rem 2rem 2rem 0;
  overflow: hidden;
  background-color: #f5f7fb;
  box-sizing: border-box;
`;

const PatientListSection = styled.div`
  flex: 0 0 38%;
  background-color: white;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  min-width: 340px;
`;

const ExaminationSection = styled.div`
  flex: 0 0 62%;
  background-color: white;
  border-radius: 0 0.5rem 0.5rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  border-left: 2px solid #e5e7eb;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 2.5rem 6rem 2.5rem;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
  scroll-behavior: smooth;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f8f9fa;
  padding: 1.25rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #374151;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }

  &:disabled {
    background: #f1f1f1;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #374151;
  min-height: 100px;
  resize: vertical;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1.5rem 2.5rem;
  background: white;
  border-top: 1px solid #e5e7eb;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  min-width: 120px;
`;

const ClearButton = styled(Button)`
  background-color: #e5e7eb;
  color: #374151;

  &:hover {
    background-color: #6b7280;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #2196f3;
  color: white;

  &:hover {
    background-color: #1976d2;
  }
`;

const PatientListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PatientListHeader = styled.div`
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PatientListTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const PatientTableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.5rem 1rem 1rem;
`;

const PatientTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHeader = styled.th`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  font-size: 1rem;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #333;
  font-size: 1rem;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const SelectButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1976d2;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 220px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  margin-left: 1rem;
`;

const FeedbackMessage = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  z-index: 1000;
  background-color: ${({ type }) => type === 'success' ? '#4CAF50' : '#f44336'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Specialist = () => {
  const [activeView, setActiveView] = useState('examination');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    address: "",
    phoneNumber: "",
    previousIssues: "",
    presentIssues: "",
    medications: "",
    teethCondition: "Good",
    gums: "Healthy",
    treatment: "",
  });

  // Show feedback message
  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => {
      setFeedback({ show: false, message: '', type });
    }, 3000);
  };

  // Load all patients
  useEffect(() => {
    const patientsRef = ref(database, 'rhp/patients');
    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const patientsList = Object.entries(data).map(([id, patient]) => ({
          id,
          ...patient
        }));
        setPatients(patientsList);
      } else {
        setPatients([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load patient data when selected
  useEffect(() => {
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        lastName: selectedPatient.personalInfo?.lastName || "",
        firstName: selectedPatient.personalInfo?.firstName || "",
        address: selectedPatient.personalInfo?.address || "",
        phoneNumber: selectedPatient.contactInfo?.phoneNumber || "",
      }));

      // Load dental history
      const dentalHistoryRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalHistory`);
      onValue(dentalHistoryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFormData(prev => ({
            ...prev,
            previousIssues: data.previousIssues || "",
            presentIssues: data.presentIssues || "",
            medications: data.medications || "",
          }));
        }
      });
    }
  }, [selectedPatient]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    showFeedback(`Selected patient: ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`);
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.personalInfo?.firstName?.toLowerCase().includes(searchLower) ||
      patient.personalInfo?.lastName?.toLowerCase().includes(searchLower) ||
      patient.registrationNumber?.toLowerCase().includes(searchLower)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClear = () => {
    setFormData({
      lastName: selectedPatient?.personalInfo?.lastName || "",
      firstName: selectedPatient?.personalInfo?.firstName || "",
      address: selectedPatient?.personalInfo?.address || "",
      phoneNumber: selectedPatient?.contactInfo?.phoneNumber || "",
      previousIssues: "",
      presentIssues: "",
      medications: "",
      teethCondition: "Good",
      gums: "Healthy",
      treatment: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      showFeedback("Please select a patient first", 'error');
      return;
    }

    try {
      // Save dental history
      const dentalHistoryRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalHistory`);
      await update(dentalHistoryRef, {
        previousIssues: formData.previousIssues,
        presentIssues: formData.presentIssues,
        medications: formData.medications,
        lastUpdated: new Date().toISOString()
      });

      // Save examination results
      const examinationRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalExaminations`);
      const newExaminationRef = push(examinationRef);
      
      await update(newExaminationRef, {
        patientId: selectedPatient.id,
        patientName: `${formData.firstName} ${formData.lastName}`,
        examinationDate: new Date().toISOString(),
        teethCondition: formData.teethCondition,
        gums: formData.gums,
        treatment: formData.treatment,
        status: 'completed'
      });

      showFeedback("Dental examination saved successfully");
      handleClear();
    } catch (error) {
      console.error("Error saving dental examination:", error);
      showFeedback("Failed to save dental examination", 'error');
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'appointments':
        return <Appo />;
      case 'examination':
        return (
          <>
            {feedback.show && (
              <FeedbackMessage
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                type={feedback.type}
              >
                {feedback.message}
              </FeedbackMessage>
            )}
            <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <PatientListSection>
                <PatientListContainer>
                  <PatientListHeader>
                    <PatientListTitle>Registered Patients</PatientListTitle>
                    <SearchInput
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </PatientListHeader>
                  <PatientTableContainer>
                    <PatientTable>
                      <thead>
                        <tr>
                          <TableHeader>Registration No.</TableHeader>
                          <TableHeader>Name</TableHeader>
                          <TableHeader>Contact</TableHeader>
                          <TableHeader>Action</TableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>{patient.registrationNumber || 'N/A'}</TableCell>
                            <TableCell>
                              {patient.personalInfo?.firstName} {patient.personalInfo?.lastName}
                            </TableCell>
                            <TableCell>{patient.contactInfo?.phoneNumber || 'N/A'}</TableCell>
                            <TableCell>
                              <SelectButton
                                onClick={() => handlePatientSelect(patient)}
                                disabled={selectedPatient?.id === patient.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {selectedPatient?.id === patient.id ? 'Selected' : 'Select'}
                              </SelectButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </PatientTable>
                  </PatientTableContainer>
                </PatientListContainer>
              </PatientListSection>

              <ExaminationSection>
                <Header>
                  <Title>Dental Examination</Title>
                </Header>

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <Input 
                      type="text" 
                      name="lastName" 
                      placeholder="Last Name" 
                      value={formData.lastName} 
                      onChange={handleChange}
                      disabled={!!selectedPatient}
                    />
                    <Input 
                      type="text" 
                      name="firstName" 
                      placeholder="First Name" 
                      value={formData.firstName} 
                      onChange={handleChange}
                      disabled={!!selectedPatient}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Address</Label>
                    <Input 
                      type="text" 
                      name="address" 
                      placeholder="Enter your address" 
                      value={formData.address} 
                      onChange={handleChange}
                      disabled={!!selectedPatient}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input 
                      type="tel" 
                      name="phoneNumber" 
                      placeholder="Enter phone number" 
                      value={formData.phoneNumber} 
                      onChange={handleChange}
                      disabled={!!selectedPatient}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Previous Dental Issues</Label>
                    <TextArea 
                      name="previousIssues" 
                      placeholder="Describe any previous dental issues" 
                      value={formData.previousIssues} 
                      onChange={handleChange} 
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Present Dental Issues</Label>
                    <TextArea 
                      name="presentIssues" 
                      placeholder="Describe current dental issues" 
                      value={formData.presentIssues} 
                      onChange={handleChange} 
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Medications</Label>
                    <TextArea 
                      name="medications" 
                      placeholder="List any current medications" 
                      value={formData.medications} 
                      onChange={handleChange} 
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Condition of Teeth</Label>
                    <Select name="teethCondition" value={formData.teethCondition} onChange={handleChange}>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Gums Condition</Label>
                    <Select name="gums" value={formData.gums} onChange={handleChange}>
                      <option value="Healthy">Healthy</option>
                      <option value="Inflamed">Inflamed</option>
                      <option value="Bleeding">Bleeding</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Recommended Treatment</Label>
                    <TextArea 
                      name="treatment" 
                      placeholder="Describe suggested treatment" 
                      value={formData.treatment} 
                      onChange={handleChange} 
                    />
                  </FormGroup>

                  <ButtonContainer>
                    <ClearButton type="button" onClick={handleClear} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Clear
                    </ClearButton>
                    <SubmitButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Submit
                    </SubmitButton>
                  </ButtonContainer>
                </Form>
              </ExaminationSection>
            </Container>
          </>
        );
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

