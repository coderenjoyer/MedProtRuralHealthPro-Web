import React, { useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";

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

const MClistappointment = () => {
  const [searchPatient, setSearchPatient] = useState("");
  const [searchAppointment, setSearchAppointment] = useState("");
  const [hoveredAppointment, setHoveredAppointment] = useState(null);

  const registeredPatients = ["Howard", "Coward", "John Doe", "Jane Smith", "Emily Clark"];

  const appointments = [
    { name: "Howard", date: "2024-02-15", time: "10:00 AM", description: "General check-up." },
    { name: "Coward", date: "2024-02-18", time: "1:00 PM", description: "Follow-up for blood tests." },
    { name: "John Doe", date: "2024-03-05", time: "9:30 AM", description: "Consultation for back pain." },
    { name: "Jane Smith", date: "2024-03-12", time: "11:15 AM", description: "Routine vaccination." },
    { name: "Emily Clark", date: "2024-04-01", time: "2:00 PM", description: "Pediatric appointment." },
  ];
  
  const filteredPatients = registeredPatients.filter((patient) =>
    patient.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchAppointment.toLowerCase())
  );

  const handleMouseEnter = (appointment, event) => {
    const rect = event.target.getBoundingClientRect();
    setHoveredAppointment({
      ...appointment,
      $top: rect.top + window.scrollY,
      $left: rect.right + 10,
    });
  };

  const handleMouseLeave = () => setHoveredAppointment(null);

  return (
    <Container>
      <Header>APPOINTMENTS</Header>

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
        <SubHeader>UPCOMING APPOINTMENTS</SubHeader>
        <SearchBar
          type="text"
          value={searchAppointment}
          onChange={(e) => setSearchAppointment(e.target.value)}
          placeholder="Search appointments..."
        />
        <List>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <ListItem
                key={index}
                onMouseEnter={(e) => handleMouseEnter(appointment, e)}
                onMouseLeave={handleMouseLeave}
              >
                {`${index + 1}.) ${appointment.name}`}
              </ListItem>
            ))
          ) : (
            <NoResults>No appointments found</NoResults>
          )}
        </List>
      </Section>

      {hoveredAppointment && (
        <Tooltip
          $left={hoveredAppointment.$left}
          $top={hoveredAppointment.$top}
          $isVisible={true}
        >
          <h4>{hoveredAppointment.name}</h4>
          <p><strong>Date:</strong> {format(new Date(hoveredAppointment.date), "MMMM dd yyyy")}</p>
          <p><strong>Time:</strong> {hoveredAppointment.time}</p>
          <p><strong>Description:</strong> {hoveredAppointment.description}</p>
        </Tooltip>
      )}
    </Container>
  );
};

export default MClistappointment;