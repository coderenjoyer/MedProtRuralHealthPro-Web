"use client"

import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import { FaBars, FaSearch } from "react-icons/fa"
import { useState, useEffect } from "react"
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../Firebase/firebase';

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
  color: #333;
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
  color: #333;
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
  
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const PatientProfileSection = styled.div`
  flex: 1;
  background: #808080;
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
  
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 1200px) {
    max-width: none;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 15px;
  margin-bottom: 20px;
  
  svg {
    color: #666;
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
  background: #007bff;
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
    background: #f5f5f5;
  }
  
  &.selected {
    background: #e6f2ff;
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
  background-color: #dc3545;
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
    background-color: #c82333;
  }
`

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
          ...value.personalInfo,
          ...value.medicalInfo,
          ...value.contactInfo
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
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient');
      }
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <Tr 
                          key={patient.id} 
                          className={selectedPatient?.id === patient.id ? "selected" : ""}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <Td>{patient.id}</Td>
                          <Td>{patient.lastName}</Td>
                          <Td>{patient.firstName}</Td>
                          <Td>{patient.dateOfBirth}</Td>
                          <Td>{patient.gender}</Td>
                          <Td>{patient.height}</Td>
                          <Td>{patient.weight}</Td>
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
                  <div className="value">{selectedPatient?.lastName || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>First Name</label>
                  <div className="value">{selectedPatient?.firstName || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Middle Name</label>
                  <div className="value">{selectedPatient?.middleName || '—'}</div>
                </ProfileField>
              </ProfileRow>

              <ProfileRow>
                <ProfileField>
                  <label>Date of Birth</label>
                  <div className="value">{selectedPatient?.dateOfBirth || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Gender</label>
                  <div className="value">{selectedPatient?.gender || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Civil Status</label>
                  <div className="value">{selectedPatient?.civilStatus || '—'}</div>
                </ProfileField>
              </ProfileRow>

              <ProfileRow>
                <ProfileField>
                  <label>Occupation</label>
                  <div className="value">{selectedPatient?.occupation || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Nationality</label>
                  <div className="value">{selectedPatient?.nationality || '—'}</div>
                </ProfileField>
                <ProfileField>
                  <label>Religion</label>
                  <div className="value">{selectedPatient?.religion || '—'}</div>
                </ProfileField>
              </ProfileRow>

              <ProfileSection>
                <ProfileField>
                  <label>Contact Information</label>
                  <div className="value">
                    <div>Phone: {selectedPatient?.contactNumber || '—'}</div>
                    <div>Email: {selectedPatient?.email || '—'}</div>
                  </div>
                </ProfileField>
              </ProfileSection>

              <ProfileSection>
                <ProfileField>
                  <label>Emergency Contact</label>
                  <div className="value">
                    <div>Name: {selectedPatient?.emergencyContact?.name || '—'}</div>
                    <div>Relationship: {selectedPatient?.emergencyContact?.relationship || '—'}</div>
                    <div>Contact: {selectedPatient?.emergencyContact?.contactNumber || '—'}</div>
                  </div>
                </ProfileField>
              </ProfileSection>

              <ProfileSection>
                <ProfileField>
                  <label>Complete Address</label>
                  <div className="value">
                    {selectedPatient?.address ? (
                      <>
                        <div>Street: {selectedPatient.address.street || '—'}</div>
                        <div>Barangay: {selectedPatient.address.barangay || '—'}</div>
                        <div>City: {selectedPatient.address.city || '—'}</div>
                        <div>Province: {selectedPatient.address.province || '—'}</div>
                        <div>Zip Code: {selectedPatient.address.zipCode || '—'}</div>
                      </>
                    ) : '—'}
                  </div>
                </ProfileField>
              </ProfileSection>

              <ProfileSection>
                <ProfileField>
                  <label>Medical Information</label>
                  <div className="value">
                    <div>Blood Type: {selectedPatient?.bloodType || '—'}</div>
                    <div>Height: {selectedPatient?.height ? `${selectedPatient.height} cm` : '—'}</div>
                    <div>Weight: {selectedPatient?.weight ? `${selectedPatient.weight} kg` : '—'}</div>
                    <div>BMI: {
                      selectedPatient?.height && selectedPatient?.weight
                        ? `${(selectedPatient.weight / Math.pow(selectedPatient.height / 100, 2)).toFixed(1)}`
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
                      {selectedPatient?.allergies?.length ? selectedPatient.allergies.join(', ') : 'None reported'}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <strong>Existing Conditions:</strong><br />
                      {selectedPatient?.existingConditions?.length ? selectedPatient.existingConditions.join(', ') : 'None reported'}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <strong>Current Medications:</strong><br />
                      {selectedPatient?.medications?.length ? selectedPatient.medications.join(', ') : 'None reported'}
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

