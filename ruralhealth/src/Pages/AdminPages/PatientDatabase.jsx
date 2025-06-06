"use client"

import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import { FaBars, FaSearch } from "react-icons/fa"
import { useState, useEffect } from "react"
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  background-color: #f5f7fb;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${(props) => (props.$isSidebarOpen ? "200px" : "0")};
  padding: 20px;
  transition: margin-left 0.3s ease;
  width: calc(100% - ${(props) => (props.$isSidebarOpen ? "200px" : "0")});
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  width: 1660px;
  height: 924px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  overflow: auto;
  
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 1700px) {
    width: 95%;
    height: auto;
  }
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #000000;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #4FC3F7;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  position: absolute;
  left: 0;

  @media (max-width: 768px) {
    display: block;
  }
`;

const PanelsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  height: calc(100% - 80px);
`;

const PatientListSection = styled.div`
  flex: 1.5;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  min-width: 0;
  overflow: auto;
  height: 100%;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PatientProfileSection = styled.div`
  flex: 1;
  background: #095D7E;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 500px;
  height: 100%;
  overflow: auto;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1200px) {
    max-width: none;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #095D7E;
  border-radius: 6px;
  padding: 10px 15px;
  margin-bottom: 20px;
  
  svg {
    color: #095D7E;
    margin-right: 10px;
    font-size: 16px;
  }
  
  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    &::placeholder {
      color: #999;
    }
  }
`

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 10px;
  
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`

const Th = styled.th`
  background: #095D7E;
  color: white;
  padding: 12px 15px;
  text-align: left;
  position: sticky;
  top: 0;
  font-weight: 500;
`

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
`

const Tr = styled.tr`
  cursor: pointer;
  
  &:hover {
    background: rgba(9, 93, 126, 0.1);
  }
  
  &.selected {
    background: rgba(9, 93, 126, 0.2);
  }
`

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  h2 {
    margin: 0;
    font-size: 18px;
    text-transform: uppercase;
  }
`

const ProfileSection = styled.div`
  margin-bottom: 15px;
`

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`

const ProfileField = styled.div`
  flex: 1;
  min-width: 0;
  
  label {
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }
  
  .value {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 0;
    min-height: 20px;
    font-size: 14px;
  }
`

const PhotoPlaceholder = styled.div`
  width: 150px;
  height: 150px;
  background-color: #d2b48c;
  margin: 0 auto 20px;
`

const DeleteButton = styled.button`
  background-color: #095D7E;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 20px;
  align-self: flex-end;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #074a63;
  }
`

const SelectButton = styled.button`
  background-color: ${props => props.$isSelected ? '#28a745' : '#095D7E'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$isSelected ? '#218838' : '#074a63'};
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export default function PatientDatabase({ isSidebarOpen, setIsSidebarOpen, setActivePage, activePage }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const patientsRef = ref(database, 'rhp/patients');
    
    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array and add the Firebase key as id
        const patientsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          personalInfo: value.personalInfo || {},
          medicalInfo: value.medicalInfo || {},
          contactInfo: value.contactInfo || {},
          address: value.address || {},
          registrationInfo: value.registrationInfo || {},
          dentalHistory: value.dentalHistory || {},
          patientVisits: value.patientVisits || {}
        }));
        setPatients(patientsArray);
      } else {
        setPatients([]);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const patientRef = ref(database, `rhp/patients/${patientId}`);
        await remove(patientRef);
        setSelectedPatient(null);
        toast.success('Patient deleted successfully');
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error('Failed to delete patient');
      }
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    toast.success(`Selected patient: ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const filteredPatients = patients.filter(patient => 
    patient.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Sidebar isOpen={isSidebarOpen} setActivePage={setActivePage} activePage={activePage} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <ContentContainer>
          <Header>
            <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </MenuButton>
            <Title>PATIENT DATABASE</Title>
          </Header>

          <PanelsContainer>
            <PatientListSection>
              <SearchBar>
                <FaSearch />
                <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBar>

              <TableContainer>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Loading patients...</div>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>Last Name</Th>
                        <Th>First Name</Th>
                        <Th>Date of Birth</Th>
                        <Th>Gender</Th>
                        <Th>Height</Th>
                        <Th>Weight</Th>
                        <Th>Action</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <Tr 
                          key={patient.id} 
                          className={selectedPatient?.id === patient.id ? "selected" : ""}
                        >
                          <Td>{patient.id}</Td>
                          <Td>{patient.personalInfo?.lastName || '—'}</Td>
                          <Td>{patient.personalInfo?.firstName || '—'}</Td>
                          <Td>{patient.personalInfo?.birthdate || '—'}</Td>
                          <Td>{patient.personalInfo?.gender || '—'}</Td>
                          <Td>{patient.medicalInfo?.height ? `${patient.medicalInfo.height} cm` : '—'}</Td>
                          <Td>{patient.medicalInfo?.weight ? `${patient.medicalInfo.weight} kg` : '—'}</Td>
                          <Td>
                            <SelectButton
                              $isSelected={selectedPatient?.id === patient.id}
                              onClick={() => handleSelectPatient(patient)}
                            >
                              {selectedPatient?.id === patient.id ? 'Selected' : 'Select'}
                            </SelectButton>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </TableContainer>
            </PatientListSection>

            <PatientProfileSection>
              <ProfileHeader>
                <h2>PATIENT PROFILE</h2>
              </ProfileHeader>

              <PhotoPlaceholder />

              <ProfileRow>
                <ProfileField>
                  <label>Last Name</label>
                  <div className="value">{selectedPatient?.personalInfo?.lastName || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>First Name</label>
                  <div className="value">{selectedPatient?.personalInfo?.firstName || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Middle Name</label>
                  <div className="value">{selectedPatient?.personalInfo?.middleName || '—'}</div>
                </ProfileField>
              </ProfileRow>

              <ProfileRow>
                <ProfileField>
                  <label>Date of Birth</label>
                  <div className="value">{selectedPatient?.personalInfo?.birthdate || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Gender</label>
                  <div className="value">{selectedPatient?.personalInfo?.gender || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Civil Status</label>
                  <div className="value">{selectedPatient?.personalInfo?.civilStatus || '—'}</div>
                </ProfileField>
              </ProfileRow>
              
              <ProfileRow>
                <ProfileField>
                  <label>Barangay</label>
                  <div className="value">{selectedPatient?.address?.barangay || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Municipality</label>
                  <div className="value">{selectedPatient?.address?.municipality || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Province</label>
                  <div className="value">{selectedPatient?.address?.province || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Street</label>
                  <div className="value">{selectedPatient?.address?.street || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Zipcode</label>
                  <div className="value">{selectedPatient?.address?.zipcode || '—'}</div>
                </ProfileField>
              </ProfileRow>

              <ProfileSection>
                <ProfileField>
                  <label>Medical Information</label>
                  <div className="value">
                    <div>Blood Type: {selectedPatient?.medicalInfo?.bloodType || '—'}</div>
                    <div>Height: {selectedPatient?.medicalInfo?.height ? `${selectedPatient.medicalInfo.height} cm` : '—'}</div>
                    <div>Weight: {selectedPatient?.medicalInfo?.weight ? `${selectedPatient.medicalInfo.weight} kg` : '—'}</div>
                    <div>BMI: {
                      selectedPatient?.medicalInfo?.height && selectedPatient?.medicalInfo?.weight
                        ? `${(selectedPatient.medicalInfo.weight / Math.pow(selectedPatient.medicalInfo.height / 100, 2)).toFixed(1)}`
                        : '—'
                    }</div>
                  </div>
                </ProfileField>
              </ProfileSection>

              <ProfileSection>
                <ProfileField>
                  <label>Medical History</label>
                  <div className="value">
                    <div>
                      <strong>Allergies:</strong><br />
                      {selectedPatient?.medicalInfo?.allergies?.length ? selectedPatient.medicalInfo.allergies.join(', ') : 'None reported'}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <strong>Existing Conditions:</strong><br />
                      {selectedPatient?.medicalInfo?.existingConditions?.length ? selectedPatient.medicalInfo.existingConditions.join(', ') : 'None reported'}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <strong>Current Medications:</strong><br />
                      {selectedPatient?.medicalInfo?.medications?.length ? selectedPatient.medicalInfo.medications.join(', ') : 'None reported'}
                    </div>
                  </div>
                </ProfileField>
              </ProfileSection>

              <ProfileSection>
                <ProfileField>
                  <label>Registration Information</label>
                  <div className="value">
                    <div>Registration Date: {selectedPatient?.registrationInfo?.registrationDate || '—'}</div>
                    <div>Registration Number: {selectedPatient?.registrationInfo?.registrationNumber || '—'}</div>
                    <div>Status: {selectedPatient?.registrationInfo?.status || '—'}</div>
                    <div>Last Visit: {selectedPatient?.registrationInfo?.lastVisit || '—'}</div>
                    <div>Next Appointment: {selectedPatient?.registrationInfo?.nextAppointment || '—'}</div>
                  </div>
                </ProfileField>
              </ProfileSection>

              {selectedPatient && (
                <DeleteButton onClick={() => handleDeletePatient(selectedPatient.id)}>
                  Delete Patient Data
                </DeleteButton>
              )}
            </PatientProfileSection>
          </PanelsContainer>
        </ContentContainer>
      </MainContent>
    </PageContainer>
  )
}

