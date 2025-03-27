"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { ref, onValue, push, update, get } from 'firebase/database';
import { database } from '../../Firebase/firebase';

const Container = styled(motion.div)`
  flex: 1;
  display: flex;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow: hidden;
`

const PatientListSection = styled.div`
  flex: 0 0 40%;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 2rem);
`

const ExaminationSection = styled.div`
  flex: 0 0 60%;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 2rem);
`

const Header = styled.div`
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  overflow-y: auto;
  height: 100%;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #555;
    }
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
`

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayDark};
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.grayDark};
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
`

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.grayDark};
  min-height: 100px;
  resize: vertical;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  position: sticky;
  bottom: 0;
`

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  min-width: 120px;
`

const ClearButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.grayLight};
  color: ${({ theme }) => theme.colors.grayDark};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`

const SubmitButton = styled(Button)`
  background-color: #2196f3;
  color: white;

  &:hover {
    background-color: #1976d2;
  }
`

const PatientListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const PatientListHeader = styled.div`
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const PatientListTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const PatientTableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #555;
    }
  }
`

const PatientTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

const TableHeader = styled.th`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  font-size: 1rem;
`

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #333;
  font-size: 1rem;
`

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`

const SelectButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
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
`

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 250px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`

const FeedbackMessage = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
  font-weight: 500;
  z-index: 1000;
  background-color: ${({ type }) => type === 'success' ? '#4CAF50' : '#f44336'};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const DentalExamination = ({ selectedPatient: propSelectedPatient }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(propSelectedPatient);
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoadError, setDataLoadError] = useState(false);

  // Show feedback message
  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => {
      setFeedback({ show: false, message: '', type });
    }, 3000);
  };

  // Load all patients with error handling
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setDataLoadError(false);
        const patientsRef = ref(database, 'rhp/patients');
        const unsubscribe = onValue(patientsRef, (snapshot) => {
          try {
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
          } catch (error) {
            console.error("Error processing patient data:", error);
            setDataLoadError(true);
            showFeedback("Error processing patient data", 'error');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading patients:", error);
        setDataLoadError(true);
        showFeedback("Failed to load patients", 'error');
      }
    };

    loadPatients();
  }, []);

  // Load patient data when selected with error handling
  useEffect(() => {
    const loadPatientData = async () => {
      if (!selectedPatient) return;

      try {
        setFormData(prev => ({
          ...prev,
          lastName: selectedPatient.personalInfo?.lastName || "",
          firstName: selectedPatient.personalInfo?.firstName || "",
          address: selectedPatient.personalInfo?.address || "",
          phoneNumber: selectedPatient.contactInfo?.phoneNumber || "",
        }));

        // Load dental history
        const dentalHistoryRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalHistory`);
        const unsubscribe = onValue(dentalHistoryRef, (snapshot) => {
          try {
            const data = snapshot.val();
            if (data) {
              setFormData(prev => ({
                ...prev,
                previousIssues: data.previousIssues || "",
                presentIssues: data.presentIssues || "",
                medications: data.medications || "",
              }));
            }
          } catch (error) {
            console.error("Error processing dental history:", error);
            showFeedback("Error loading dental history", 'error');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading patient data:", error);
        showFeedback("Failed to load patient data", 'error');
      }
    };

    loadPatientData();
  }, [selectedPatient]);

  const handlePatientSelect = (patient) => {
    try {
      if (!patient || !patient.id) {
        throw new Error("Invalid patient data");
      }
      setSelectedPatient(patient);
      showFeedback(`Selected patient: ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`);
    } catch (error) {
      console.error("Error selecting patient:", error);
      showFeedback("Error selecting patient", 'error');
    }
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.personalInfo?.firstName?.toLowerCase().includes(searchLower) ||
      patient.personalInfo?.lastName?.toLowerCase().includes(searchLower) ||
      patient.registrationNumber?.toLowerCase().includes(searchLower)
    );
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Required fields validation
    if (!formData.presentIssues.trim()) {
      errors.presentIssues = "Present dental issues are required";
      isValid = false;
    }

    if (!formData.treatment.trim()) {
      errors.treatment = "Recommended treatment is required";
      isValid = false;
    }

    // Length validation
    if (formData.previousIssues.length > 1000) {
      errors.previousIssues = "Previous issues cannot exceed 1000 characters";
      isValid = false;
    }

    if (formData.presentIssues.length > 1000) {
      errors.presentIssues = "Present issues cannot exceed 1000 characters";
      isValid = false;
    }

    if (formData.medications.length > 500) {
      errors.medications = "Medications list cannot exceed 500 characters";
      isValid = false;
    }

    if (formData.treatment.length > 1000) {
      errors.treatment = "Treatment description cannot exceed 1000 characters";
      isValid = false;
    }

    // Phone number validation if provided
    if (formData.phoneNumber && !/^(\+63|0)[\d\s\-]{9,}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid Philippine phone number";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    // Sanitize input based on field type
    let sanitizedValue = value;
    switch (name) {
      case 'previousIssues':
      case 'presentIssues':
      case 'medications':
      case 'treatment':
        // Remove any potentially harmful characters
        sanitizedValue = value.replace(/[<>]/g, '');
        break;
      case 'phoneNumber':
        // Only allow digits, spaces, hyphens, and + symbol
        sanitizedValue = value.replace(/[^\d\s\-+]/g, '');
        break;
      default:
        sanitizedValue = value;
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleClear = () => {
    try {
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
      });
      setFormErrors({});
      showFeedback("Form cleared successfully");
    } catch (error) {
      console.error("Error clearing form:", error);
      showFeedback("Error clearing form", 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      showFeedback("Please select a patient first", 'error');
      return;
    }

    if (!validateForm()) {
      showFeedback("Please correct the errors in the form", 'error');
      return;
    }

    if (isSubmitting) {
      showFeedback("Please wait while we process your submission", 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save dental history
      const dentalHistoryRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalHistory`);
      await update(dentalHistoryRef, {
        previousIssues: formData.previousIssues.trim(),
        presentIssues: formData.presentIssues.trim(),
        medications: formData.medications.trim(),
        lastUpdated: new Date().toISOString()
      });

      // Save examination results
      const examinationRef = ref(database, `rhp/patients/${selectedPatient.id}/dentalExaminations`);
      const newExaminationRef = push(examinationRef);
      
      await update(newExaminationRef, {
        patientId: selectedPatient.id,
        patientName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        examinationDate: new Date().toISOString(),
        teethCondition: formData.teethCondition,
        gums: formData.gums,
        treatment: formData.treatment.trim(),
        status: 'completed'
      });

      showFeedback("Dental examination saved successfully");
      handleClear();
    } catch (error) {
      console.error("Error saving dental examination:", error);
      showFeedback("Failed to save dental examination", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onChange={(e) => {
                  const value = e.target.value;
                  // Sanitize search input
                  const sanitizedValue = value.replace(/[^A-Za-z0-9\s\-'\.]/g, '');
                  setSearchTerm(sanitizedValue);
                }}
                maxLength="50"
              />
            </PatientListHeader>
            <PatientTableContainer>
              {dataLoadError ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  color: '#dc3545'
                }}>
                  Error loading patients. Please try again later.
                </div>
              ) : (
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
              )}
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
                maxLength="1000"
                className={formErrors.previousIssues ? 'is-invalid' : ''}
              />
              {formErrors.previousIssues && (
                <div className="invalid-feedback">{formErrors.previousIssues}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Present Dental Issues *</Label>
              <TextArea 
                name="presentIssues" 
                placeholder="Describe current dental issues" 
                value={formData.presentIssues} 
                onChange={handleChange}
                maxLength="1000"
                required
                className={formErrors.presentIssues ? 'is-invalid' : ''}
              />
              {formErrors.presentIssues && (
                <div className="invalid-feedback">{formErrors.presentIssues}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Medications</Label>
              <TextArea 
                name="medications" 
                placeholder="List any current medications" 
                value={formData.medications} 
                onChange={handleChange}
                maxLength="500"
                className={formErrors.medications ? 'is-invalid' : ''}
              />
              {formErrors.medications && (
                <div className="invalid-feedback">{formErrors.medications}</div>
              )}
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
              <Label>Recommended Treatment *</Label>
              <TextArea 
                name="treatment" 
                placeholder="Describe suggested treatment" 
                value={formData.treatment} 
                onChange={handleChange}
                maxLength="1000"
                required
                className={formErrors.treatment ? 'is-invalid' : ''}
              />
              {formErrors.treatment && (
                <div className="invalid-feedback">{formErrors.treatment}</div>
              )}
            </FormGroup>

            <ButtonContainer>
              <ClearButton 
                type="button" 
                onClick={handleClear} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                Clear
              </ClearButton>
              <SubmitButton 
                type="submit" 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Submit'}
              </SubmitButton>
            </ButtonContainer>
          </Form>
        </ExaminationSection>
      </Container>
    </>
  );
};

export default DentalExamination;
