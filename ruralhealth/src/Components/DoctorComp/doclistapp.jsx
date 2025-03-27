import React, { useState, useEffect } from "react";
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

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  margin: 10px 0;
  text-align: center;
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 10px;
  margin: 10px 0;
  text-align: center;
`;

const MClistappointment = () => {
  const [searchPatient, setSearchPatient] = useState("");
  const [searchAppointment, setSearchAppointment] = useState("");
  const [hoveredAppointment, setHoveredAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Simulated data loading with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated data
        const patients = ["Howard", "Coward", "John Doe", "Jane Smith", "Emily Clark"];
        const appointmentsData = [
          { name: "Howard", date: "2024-02-15", time: "10:00 AM", description: "General check-up." },
          { name: "Coward", date: "2024-02-18", time: "1:00 PM", description: "Follow-up for blood tests." },
          { name: "John Doe", date: "2024-03-05", time: "9:30 AM", description: "Consultation for back pain." },
          { name: "Jane Smith", date: "2024-03-12", time: "11:15 AM", description: "Routine vaccination." },
          { name: "Emily Clark", date: "2024-04-01", time: "2:00 PM", description: "Pediatric appointment." },
        ];

        // Validate data before setting state
        if (!Array.isArray(patients) || !Array.isArray(appointmentsData)) {
          throw new Error('Invalid data format received');
        }

        setRegisteredPatients(patients);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sanitize and validate search input
  const handleSearchPatient = (e) => {
    try {
      const value = e.target.value;
      // Only allow alphanumeric characters, spaces, and basic punctuation
      const sanitizedValue = value.replace(/[^A-Za-z0-9\s\-'\.]/g, '');
      setSearchPatient(sanitizedValue);
    } catch (error) {
      console.error('Error handling search input:', error);
      setError('Error processing search input');
    }
  };

  const handleSearchAppointment = (e) => {
    try {
      const value = e.target.value;
      // Only allow alphanumeric characters, spaces, and basic punctuation
      const sanitizedValue = value.replace(/[^A-Za-z0-9\s\-'\.]/g, '');
      setSearchAppointment(sanitizedValue);
    } catch (error) {
      console.error('Error handling search input:', error);
      setError('Error processing search input');
    }
  };

  // Filter patients with error handling
  const filteredPatients = React.useMemo(() => {
    try {
      return registeredPatients.filter((patient) =>
        patient.toLowerCase().includes(searchPatient.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering patients:', error);
      return [];
    }
  }, [registeredPatients, searchPatient]);

  // Filter appointments with error handling
  const filteredAppointments = React.useMemo(() => {
    try {
      return appointments.filter((appointment) =>
        appointment.name.toLowerCase().includes(searchAppointment.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering appointments:', error);
      return [];
    }
  }, [appointments, searchAppointment]);

  const handleMouseEnter = (appointment, event) => {
    try {
      if (!appointment || !event.target) {
        throw new Error('Invalid appointment or event data');
      }

      const rect = event.target.getBoundingClientRect();
      setHoveredAppointment({
        ...appointment,
        $top: rect.top + window.scrollY,
        $left: rect.right + 10,
      });
    } catch (error) {
      console.error('Error handling mouse enter:', error);
      setError('Error displaying appointment details');
    }
  };

  const handleMouseLeave = () => {
    try {
      setHoveredAppointment(null);
    } catch (error) {
      console.error('Error handling mouse leave:', error);
      setError('Error hiding appointment details');
    }
  };

  return (
    <Container>
      <Header>APPOINTMENTS</Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoading && <LoadingMessage>Loading data...</LoadingMessage>}

      <Section>
        <SubHeader>REGISTERED PATIENTS</SubHeader>
        <SearchBar
          type="text"
          value={searchPatient}
          onChange={handleSearchPatient}
          placeholder="Search patients..."
          maxLength="50"
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
          onChange={handleSearchAppointment}
          placeholder="Search appointments..."
          maxLength="50"
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