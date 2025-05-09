"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { ref, onValue, push, update, get } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: ${({ isSidebarOpen }) => isSidebarOpen ? '240px 1fr' : '56px 1fr'};
  height: 100vh;
  overflow: hidden;
  transition: grid-template-columns 0.3s ease-in-out;
  position: relative;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const ContentWrapper = styled.div`
  padding: 2rem;
  height: calc(100vh - 4rem);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  background: #f5f7fa;
  overflow: hidden;
  margin-left: ${({ isSidebarOpen }) => isSidebarOpen ? '240px' : '56px'};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    padding: 1rem;
    margin-left: 0;
  }
`

const PatientListSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ExaminationSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Header = styled.div`
  background: linear-gradient(90deg, #4FC3F7 0%, #81D4FA 100%);
  color: white;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  overflow-y: auto;
  height: 100%;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
    
    &:hover {
      background: #9ca3af;
    }
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f1f3f5;
  transition: all 0.2s ease;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4FC3F7;
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  min-height: 120px;
  resize: vertical;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4FC3F7;
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4FC3F7;
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #f1f3f5;
  position: sticky;
  bottom: 0;
`

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
`

const ClearButton = styled(Button)`
  background: #e5e7eb;
  color: #374151;

  &:hover {
    background: #d1d5db;
  }
`

const SubmitButton = styled(Button)`
  background: #4FC3F7;
  color: white;

  &:hover {
    background: #29B6F6;
  }
`

const PatientListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const PatientListHeader = styled.div`
  background: linear-gradient(90deg, #4FC3F7 0%, #81D4FA 100%);
  color: white;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PatientListTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;
`

const PatientTableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
    
    &:hover {
      background: #9ca3af;
    }
  }
`

const PatientTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

const TableHeader = styled.th`
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 500;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
`

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.875rem;
`

const TableRow = styled.tr`
  transition: all 0.2s ease;
  &:hover {
    background: #f9fafb;
  }
`

const SelectButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #4FC3F7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: #29B6F6;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 200px;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`

const FeedbackMessage = styled(motion.div)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1000;
  background: ${({ type }) => type === 'success' ? '#22c55e' : '#ef4444'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const DentalExamination = ({ selectedPatient: propSelectedPatient, isSidebarOpen }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(propSelectedPatient);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    address: "",
    email: "",
    contactNumber: "",
    previousIssues: "",
    presentIssues: "",
    medications: "",
    teethCondition: "Good",
    gums: "Healthy",
    treatment: "",
  });

  const [previousData, setPreviousData] = useState({
    medications: "",
    teethCondition: "",
    gums: ""
  });

  const showFeedback = (message, type = 'success') => {
    // Prevent duplicate notifications
    toast.dismiss();
    
    if (type === 'success') {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

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

  useEffect(() => {
    if (selectedPatient) {
      // Set personal information
      setFormData(prev => ({
        ...prev,
        lastName: selectedPatient.personalInfo?.lastName || "",
        firstName: selectedPatient.personalInfo?.firstName || "",
        address: selectedPatient.personalInfo?.address || "",
        email: selectedPatient.contactInfo?.email || "",
        contactNumber: selectedPatient.contactInfo?.contactNumber || "",
        // Clear current examination fields
        presentIssues: "",
        medications: "",
        teethCondition: "Good",
        gums: "Healthy",
        treatment: ""
      }));

      // Load previous dental history
      const dentalHistoryRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalHistory`);
      onValue(dentalHistoryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFormData(prev => ({
            ...prev,
            // Set previous issues from history
            previousIssues: data.presentIssues || "",
          }));
        }
      });

      // Load last examination data
      const examinationsRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalExaminations`);
      onValue(examinationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Get the last examination
          const lastExamination = Object.values(data).pop();
          setPreviousData({
            medications: lastExamination.medications || "",
            teethCondition: lastExamination.teethCondition || "",
            gums: lastExamination.gums || ""
          });
        }
      });
    }
  }, [selectedPatient]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      lastName: patient.personalInfo?.lastName || "",
      firstName: patient.personalInfo?.firstName || "",
      email: patient.contactInfo?.email || "",
      contactNumber: patient.contactInfo?.contactNumber || "",
    }));
    showFeedback(`Selected patient: ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`);
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.personalInfo?.firstName?.toLowerCase().includes(searchLower) ||
      patient.personalInfo?.lastName?.toLowerCase().includes(searchLower) ||
      patient.id?.toLowerCase().includes(searchLower)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClear = () => {
    if (selectedPatient) {
      setFormData({
        lastName: selectedPatient.personalInfo?.lastName || "",
        firstName: selectedPatient.personalInfo?.firstName || "",
        address: selectedPatient.personalInfo?.address || "",
        email: selectedPatient.contactInfo?.email || "",
        contactNumber: selectedPatient.contactInfo?.contactNumber || "",
        previousIssues: formData.previousIssues || "", // Keep previous issues
        presentIssues: "",
        medications: "",
        teethCondition: "Good",
        gums: "Healthy",
        treatment: "",
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPatient) {
        toast.error("Please select a patient first");
        return;
    }

    // Create confirmation message
    const confirmationMessage = `
Please confirm the following information is correct:

Patient Information:
------------------
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Contact: ${formData.contactNumber}

Dental Examination:
-----------------
Previous Issues: ${formData.previousIssues || 'None'}
Current Issues: ${formData.presentIssues || 'None'}
Current Medications: ${formData.medications || 'None'}
Teeth Condition: ${formData.teethCondition}
Gums Condition: ${formData.gums}
Recommended Treatment: ${formData.treatment || 'None'}

Is this information correct?`;

    // Show confirmation dialog
    const isConfirmed = window.confirm(confirmationMessage);
    if (!isConfirmed) {
        return;
    }

    try {
        // Create a new dental examination record
        const examinationData = {
            patientId: selectedPatient.id,
            patientName: `${formData.firstName} ${formData.lastName}`,
            examinationDate: new Date().toISOString(),
            teethCondition: formData.teethCondition,
            gums: formData.gums,
            treatment: formData.treatment,
            previousIssues: formData.previousIssues,
            presentIssues: formData.presentIssues,
            medications: formData.medications,
            status: 'completed'
        };

        // Create visit record
        const visitData = {
            timestamp: new Date().toISOString(),
            type: 'dental',
            teethCondition: formData.teethCondition,
            gums: formData.gums,
            treatment: formData.treatment,
            previousIssues: formData.previousIssues,
            presentIssues: formData.presentIssues,
            medications: formData.medications
        };

        // Get patient data first
        const patientRef = ref(database, `rhp/patients/${selectedPatient.id}`);
        const patientSnapshot = await get(patientRef);
        const patientData = patientSnapshot.val();

        if (!patientData) {
            throw new Error("Patient not found");
        }

        // Create updates object
        const updates = {};

        // Initialize or update patientVisits
        if (!patientData.patientVisits) {
            updates[`rhp/patients/${selectedPatient.id}/patientVisits`] = {
                visits: [visitData]
            };
        } else {
            const visitsRef = ref(database, `rhp/patients/${selectedPatient.id}/patientVisits/visits`);
            const newVisitRef = push(visitsRef);
            const newVisitKey = newVisitRef.key;
            updates[`rhp/patients/${selectedPatient.id}/patientVisits/visits/${newVisitKey}`] = visitData;
        }

        // Initialize or update dentalExaminations
        if (!patientData.dentalExaminations) {
            updates[`rhp/patients/${selectedPatient.id}/dentalExaminations`] = {
                [new Date().getTime()]: examinationData
            };
        } else {
            const examinationRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalExaminations`);
            const newExaminationRef = push(examinationRef);
            const newExamKey = newExaminationRef.key;
            updates[`rhp/patients/${selectedPatient.id}/dentalExaminations/${newExamKey}`] = examinationData;
        }

        // Initialize or update dentalHistory
        updates[`rhp/patients/${selectedPatient.id}/dentalHistory`] = {
            previousIssues: formData.previousIssues,
            presentIssues: formData.presentIssues,
            medications: formData.medications,
            lastUpdated: new Date().toISOString()
        };

        // Initialize or update registrationInfo
        if (!patientData.registrationInfo) {
            updates[`rhp/patients/${selectedPatient.id}/registrationInfo`] = {
                lastVisit: new Date().toISOString(),
                lastDentalVisit: new Date().toISOString()
            };
        } else {
            updates[`rhp/patients/${selectedPatient.id}/registrationInfo/lastVisit`] = new Date().toISOString();
            updates[`rhp/patients/${selectedPatient.id}/registrationInfo/lastDentalVisit`] = new Date().toISOString();
        }

        // Apply all updates
        await update(ref(database), updates);

        toast.success("Dental examination saved successfully");
        handleClear();
    } catch (error) {
        console.error("Error saving dental examination:", error);
        toast.error(error.message || "Failed to save dental examination");
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
      <MainContainer isSidebarOpen={isSidebarOpen}>
        <div /> {/* Placeholder for sidebar */}
        <ContentWrapper isSidebarOpen={isSidebarOpen}>
          <PatientListSection>
            <PatientListContainer>
              <PatientListHeader>
                <PatientListTitle>Patients</PatientListTitle>
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
                      <TableHeader>Patient ID</TableHeader>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Contact</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.id || 'N/A'}</TableCell>
                        <TableCell>
                          {patient.personalInfo?.firstName} {patient.personalInfo?.lastName}
                        </TableCell>
                        <TableCell>{patient.contactInfo?.contactNumber || 'N/A'}</TableCell>
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
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    disabled={!!selectedPatient}
                    style={{ flex: 1 }}
                  />
                  <Input 
                    type="text" 
                    name="firstName" 
                    placeholder="First Name" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    disabled={!!selectedPatient}
                    style={{ flex: 1 }}
                  />
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  name="email" 
                  placeholder="Enter email address" 
                  value={formData.email} 
                  onChange={handleChange}
                  disabled={!!selectedPatient}
                />
              </FormGroup>

              <FormGroup>
                <Label>Contact Number</Label>
                <Input 
                  type="tel" 
                  name="contactNumber" 
                  placeholder="Enter contact number" 
                  value={formData.contactNumber} 
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
                <Label>Current Dental Issues</Label>
                <TextArea 
                  name="presentIssues" 
                  placeholder="Describe current dental issues" 
                  value={formData.presentIssues} 
                  onChange={handleChange} 
                />
              </FormGroup>

              <FormGroup>
                <Label>Previous Medications</Label>
                <div style={{ 
                  padding: '0.5rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#4B5563'
                }}>
                  {previousData.medications || 'No previous medications recorded'}
                </div>
                <Label>Current Medications</Label>
                <TextArea 
                  name="medications" 
                  placeholder="List current medications" 
                  value={formData.medications} 
                  onChange={handleChange} 
                />
              </FormGroup>

              <FormGroup>
                <Label>Previous Teeth Condition</Label>
                <div style={{ 
                  padding: '0.5rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#4B5563'
                }}>
                  {previousData.teethCondition || 'No previous teeth condition recorded'}
                </div>
                <Label>Current Teeth Condition</Label>
                <Select name="teethCondition" value={formData.teethCondition} onChange={handleChange}>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Previous Gums Condition</Label>
                <div style={{ 
                  padding: '0.5rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#4B5563'
                }}>
                  {previousData.gums || 'No previous gums condition recorded'}
                </div>
                <Label>Current Gums Condition</Label>
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
        </ContentWrapper>
      </MainContainer>
    </>
  )
}

export default DentalExamination