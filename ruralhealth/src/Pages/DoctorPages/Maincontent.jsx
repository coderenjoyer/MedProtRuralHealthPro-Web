import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex-grow: 1;
  padding: 20px 40px;
  font-family: Arial, sans-serif;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
`;

const Header = styled.h1`
  font-size: 1.8rem;
  color: black;
  text-align: center;
  font-weight: bold;
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
  min-height: 250px;
  overflow: hidden;
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
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fdfdfd;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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

const MainContentList = () => {
  const [searchPatient, setSearchPatient] = useState("");
  const [searchMedicine, setSearchMedicine] = useState("");
  const [hoveredMedicine, setHoveredMedicine] = useState(null);

  const patients = ["Howard", "Coward", "John", "Doe", "Jane", "Smith"];
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

  const filteredPatients = patients.filter((patient) =>
    patient.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchMedicine.toLowerCase())
  );

  const handleMouseEnter = (medicine, event) => {
    const rect = event.target.getBoundingClientRect();
    setHoveredMedicine({
      name: medicine.name,
      brand: medicine.brand,
      description: medicine.description,
      quantity: medicine.quantity,
      expiration: medicine.expiration,
      $top: rect.top + window.scrollY,
      $left: rect.right + 10,
    });
  };

  const handleMouseLeave = () => setHoveredMedicine(null);

  return (
    <Container>
      <Header>MEDICAL HISTORY</Header>
      <Section>
        <SubHeader>REGISTERED PATIENTS</SubHeader>
        <SearchBar
          type="text"
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
          placeholder="Search patients..."
        />
        <List>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <ListItem key={index}>{`${index + 1}.) ${patient}`}</ListItem>
            ))
          ) : (
            <NoResults>No patients found</NoResults>
          )}
        </List>
      </Section>

      <Section>
        <SubHeader>AVAILABLE MEDICINES</SubHeader>
        <SearchBar
          type="text"
          value={searchMedicine}
          onChange={(e) => setSearchMedicine(e.target.value)}
          placeholder="Search medicines..."
        />
        <List>
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine, index) => (
              <ListItem
                key={index}
                onMouseEnter={(e) => handleMouseEnter(medicine, e)}
                onMouseLeave={handleMouseLeave}
              >
                {`${index + 1}.) ${medicine.name}`}
              </ListItem>
            ))
          ) : (
            <NoResults>No medicines found</NoResults>
          )}
        </List>
      </Section>

      {hoveredMedicine && (
        <Tooltip
          $left={hoveredMedicine.$left}
          $top={hoveredMedicine.$top}
          $isVisible={true}
        >
          <h4>{hoveredMedicine.name}</h4>
          <p><strong>Brand:</strong> {hoveredMedicine.brand || "N/A"}</p>
          <p><strong>Description:</strong> {hoveredMedicine.description || "N/A"}</p>
          <p><strong>Quantity:</strong> {hoveredMedicine.quantity || "N/A"}</p>
          <p><strong>Expiration:</strong> {hoveredMedicine.expiration || "N/A"}</p>
        </Tooltip>
      )}
    </Container>
  );
};

export default MainContentList;