import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ref, onValue } from "firebase/database";
import { database } from "../../Firebase/firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  height: 100%;
  overflow: hidden;
  min-height: 0;
`;

const Header = styled.h1`
  font-size: 1.8rem;
  color: black;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const SubHeader = styled.h2`
  font-size: 1.4rem;
  color: black;
  margin-bottom: 10px;
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  &:first-of-type {
    margin-bottom: 20px;
  }
`;

const SearchBar = styled.input`
  width: 90%;
  margin: 0 auto;
  display: block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fdfdfd;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  min-height: 0;
`;

const ListItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  border-radius: 8px;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
  ${props => props.$selected && `
    background-color: #e0f7fa;
    border-left: 4px solid #4dd0e1;
  `}
`;

const Tooltip = styled.div`
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 12px;
  border-radius: 12px;
  width: 260px;
  z-index: 100;
  left: ${(props) => props.$left}px;
  top: ${(props) => props.$top}px;
  transform: translate(10px, -50%);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;

  ${({ $isVisible }) =>
    $isVisible && `
      opacity: 1;
      visibility: visible;
      transform: translate(15px, -50%);
    `}

  h4 {
    margin: 0 0 8px;
  }

  p {
    margin: 4px 0;
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: gray;
  font-style: italic;
  margin-top: 10px;
`;

const MainContentList = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const patientsRef = ref(database, "rhp/patients");
    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const patientsList = Object.entries(data).map(([id, patient]) => ({
          id,
          ...patient,
        }));
        setPatients(patientsList);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient);
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
    setSelectedPatient(null);
    onPatientSelect(null);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const medicines = [
    { name: "Aspirin", brand: "Bayer", description: "Pain reliever and anti-inflammatory.", quantity: "50 tablets", expiration: "2025-12-01" },
    { name: "Ibuprofen", brand: "Advil", description: "Used to reduce fever and treat pain.", quantity: "100 tablets", expiration: "2026-06-15" },
    { name: "Paracetamol", brand: null, description: null, quantity: "30 tablets", expiration: null },
    { name: "Amoxicillin", brand: "Moxatag", description: null, quantity: null, expiration: "2024-11-30" },
    { name: "Metformin", brand: null, description: "Medication for Type 2 diabetes.", quantity: null, expiration: "2025-09-15" },
    { name: "Lisinopril", brand: "Zestril", description: null, quantity: "60 tablets", expiration: null },
    { name: "Atorvastatin", brand: null, description: null, quantity: null, expiration: null },
    { name: "Omeprazole", brand: "Prilosec", description: "Used to treat acid reflux.", quantity: "40 capsules", expiration: "2027-01-10" },
    { name: "Losartan", brand: null, description: "Used to treat high blood pressure.", quantity: "20 tablets", expiration: null },
    { name: "Hydrochlorothiazide", brand: "Microzide", description: null, quantity: "25 tablets", expiration: null },
  ];

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>PATIENT LIST</Header>
      {isMinimized ? (
        <MinimizedView>
          <MinimizedHeader>Selected Patient</MinimizedHeader>
          <SelectedPatientInfo>
            <PatientName>
              {selectedPatient?.personalInfo.firstName} {selectedPatient?.personalInfo.lastName}
            </PatientName>
            <ExpandButton onClick={handleExpand}>Expand List</ExpandButton>
          </SelectedPatientInfo>
        </MinimizedView>
      ) : (
        <>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <PatientList>
            {filteredPatients.map((patient) => (
              <PatientItem
                key={patient.id}
                onClick={() => handlePatientClick(patient)}
                $isSelected={selectedPatient?.id === patient.id}
              >
                <PatientName>
                  {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                </PatientName>
                <PatientDetails>
                  <DetailItem>Age: {patient.personalInfo.age}</DetailItem>
                  <DetailItem>Gender: {patient.personalInfo.gender}</DetailItem>
                </PatientDetails>
              </PatientItem>
            ))}
          </PatientList>
        </>
      )}
    </Container>
  );
};

const MinimizedView = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 100%;
`;

const MinimizedHeader = styled.h3`
  margin: 0 0 10px 0;
  color: #666;
  font-size: 1rem;
`;

const SelectedPatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExpandButton = styled.button`
  padding: 8px 16px;
  background-color: #4dd0e1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00bcd4;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const PatientList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fdfdfd;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  min-height: 0;
`;

const PatientItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  border-radius: 8px;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
  ${props => props.$isSelected && `
    background-color: #e0f7fa;
    border-left: 4px solid #4dd0e1;
  `}
`;

const PatientName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1rem;
`;

const PatientDetails = styled.div`
  display: flex;
  gap: 10px;
`;

const DetailItem = styled.span`
  font-size: 0.9rem;
`;

export default MainContentList;