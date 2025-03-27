"use client"

import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import { FaBars, FaSearch } from "react-icons/fa"
import { useState, useEffect } from "react"
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { useNavigate } from "react-router-dom";

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
  color: #4FC3F7;
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(9, 93, 126, 0.3);
  border-radius: 50%;
  border-top-color: #095D7E;
  animation: spin 1s ease-in-out infinite;
  margin: 20px auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`;

const RetryButton = styled.button`
  background-color: #095D7E;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0d4a63;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid ${props => props.$hasError ? '#dc3545' : '#095D7E'};
  border-radius: 6px;
  padding: 10px 15px;
  margin-bottom: 20px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
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

    &:focus {
      box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(9, 93, 126, 0.25)'};
    }
  }
`;

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
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

export default function PatientDatabase({ isSidebarOpen, setIsSidebarOpen, setActivePage, activePage }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const navigate = useNavigate();

  // Validate user session
  useEffect(() => {
    const validateSession = () => {
      try {
        const user = localStorage.getItem("user")
        if (!user) {
          throw new Error('No active session found')
        }

        const userData = JSON.parse(user)
        if (userData.type !== "Staff-Admin") {
          throw new Error('Unauthorized access')
        }

        // Additional session validation logic here
      } catch (error) {
        console.error('Session validation error:', error)
        setError(error.message)
        // Redirect to login after showing error
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    }

    validateSession()
  }, [navigate])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsRetrying(false)

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
          console.error('Error processing patient data:', error);
          setError('Error loading patient data');
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up patient listener:', error);
      setError('Failed to connect to database');
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchPatients();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSearch = (e) => {
    try {
      const value = e.target.value;
      // Sanitize input - only allow alphanumeric characters, spaces, and basic punctuation
      const sanitizedValue = value.replace(/[^A-Za-z0-9\s\-'\.]/g, '');
      setSearchTerm(sanitizedValue);
      setSearchError(null);
    } catch (error) {
      console.error('Error handling search:', error);
      setSearchError('Error processing search input');
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const patientRef = ref(database, `rhp/patients/${patientId}`);
      await remove(patientRef);
      
      // Clear selected patient if it was deleted
      if (selectedPatient?.id === patientId) {
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Failed to delete patient');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    fetchPatients();
  };

  const filteredPatients = patients.filter(patient => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.personalInfo?.firstName?.toLowerCase().includes(searchLower) ||
      patient.personalInfo?.lastName?.toLowerCase().includes(searchLower) ||
      patient.personalInfo?.middleName?.toLowerCase().includes(searchLower) ||
      patient.contactInfo?.address?.barangay?.toLowerCase().includes(searchLower) ||
      patient.contactInfo?.contactNumber?.includes(searchTerm)
    );
  });

  if (error) {
    return (
      <PageContainer>
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} setActivePage={setActivePage} activePage={activePage} />
        <MainContent $isSidebarOpen={isSidebarOpen}>
          <ErrorMessage>
            {error}
            <p>Redirecting to login...</p>
          </ErrorMessage>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} setActivePage={setActivePage} activePage={activePage} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <ContentContainer>
          <Header>
            <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </MenuButton>
            <Title>Patient Database</Title>
          </Header>

          <PanelsContainer>
            <PatientListSection>
              <SearchBar $hasError={!!searchError}>
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={handleSearch}
                  maxLength="50"
                  pattern="[A-Za-z0-9\s\-'\.]+"
                  title="Only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed"
                />
              </SearchBar>
              {searchError && <ErrorMessage>{searchError}</ErrorMessage>}

              {loading ? (
                <LoadingContainer>
                  <LoadingSpinner />
                  <p>Loading patients...</p>
                </LoadingContainer>
              ) : (
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Name</Th>
                        <Th>Barangay</Th>
                        <Th>Contact</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <Tr
                            key={patient.id}
                            className={selectedPatient?.id === patient.id ? 'selected' : ''}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <Td>
                              {patient.personalInfo?.lastName}, {patient.personalInfo?.firstName}
                            </Td>
                            <Td>{patient.contactInfo?.address?.barangay || 'N/A'}</Td>
                            <Td>{patient.contactInfo?.contactNumber || 'N/A'}</Td>
                            <Td>
                              <DeleteButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePatient(patient.id);
                                }}
                                disabled={loading}
                              >
                                Delete
                              </DeleteButton>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                            No patients found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </TableContainer>
              )}
            </PatientListSection>

            <PatientProfileSection>
              {selectedPatient ? (
                <>
                  <ProfileHeader>
                    <h2>Patient Profile</h2>
                  </ProfileHeader>
                  <ProfileSection>
                    <ProfileRow>
                      <div>
                        <strong>Name:</strong>
                        <p>
                          {selectedPatient.personalInfo?.lastName}, {selectedPatient.personalInfo?.firstName}
                          {selectedPatient.personalInfo?.middleName ? ` ${selectedPatient.personalInfo.middleName}` : ''}
                        </p>
                      </div>
                      <div>
                        <strong>Gender:</strong>
                        <p>{selectedPatient.personalInfo?.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <strong>Date of Birth:</strong>
                        <p>
                          {selectedPatient.personalInfo?.dateOfBirth
                            ? new Date(selectedPatient.personalInfo.dateOfBirth).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </ProfileRow>
                    <ProfileRow>
                      <div>
                        <strong>Barangay:</strong>
                        <p>{selectedPatient.contactInfo?.address?.barangay || 'N/A'}</p>
                      </div>
                      <div>
                        <strong>Contact Number:</strong>
                        <p>{selectedPatient.contactInfo?.contactNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <strong>Email:</strong>
                        <p>{selectedPatient.contactInfo?.email || 'N/A'}</p>
                      </div>
                    </ProfileRow>
                    <ProfileRow>
                      <div>
                        <strong>Registration Date:</strong>
                        <p>
                          {selectedPatient.registrationInfo?.registrationDate
                            ? new Date(selectedPatient.registrationInfo.registrationDate).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <strong>Status:</strong>
                        <p>{selectedPatient.registrationInfo?.status || 'N/A'}</p>
                      </div>
                    </ProfileRow>
                  </ProfileSection>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  Select a patient to view their profile
                </div>
              )}
            </PatientProfileSection>
          </PanelsContainer>
        </ContentContainer>
      </MainContent>
    </PageContainer>
  );
}

