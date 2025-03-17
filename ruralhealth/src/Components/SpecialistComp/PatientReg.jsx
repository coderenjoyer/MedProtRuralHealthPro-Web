"use client"

import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

const RegistryContainer = styled(motion.div)`
  width: 400px;
  min-width: 350px;
  max-width: 450px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const RegistryHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
`

const RegistryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`

const SearchContainer = styled.div`
  position: relative;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray};
`

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 0.75rem 0.75rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
`

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 1;
`

const TableHeader = styled.th`
  padding: 0.5rem 0.25rem;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondaryDark};
  border-bottom: 2px solid ${({ theme }) => theme.colors.grayLight};
  white-space: nowrap;
  font-size: 0.75rem;
`

const TableRow = styled(motion.tr)`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayLight};
  }
`

const TableCell = styled.td`
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
`

const PatientRegistry = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample patient data
  const patients = [
    {
      id: 20,
      lastName: "Torreon",
      firstName: "Mari Emmanuel",
      street: "Consolacion",
      phone: "09166425712",
      previous: "Toothache",
      allergies: "none",
      current: "Scaling",
    },
    {
      id: 21,
      lastName: "Roxana",
      firstName: "Michael Angelo",
      street: "Labanon",
      phone: "09164367",
      previous: "",
      allergies: "",
      current: "",
    },
    {
      id: 22,
      lastName: "Pennional",
      firstName: "Johanna Mae",
      street: "Talisay",
      phone: "09628476165",
      previous: "",
      allergies: "",
      current: "",
    },
    {
      id: 24,
      lastName: "Raden",
      firstName: "Alijah",
      street: "Any",
      phone: "09817421638",
      previous: "",
      allergies: "",
      current: "",
    },
    {
      id: 26,
      lastName: "Paque",
      firstName: "Khalil",
      street: "Alegria",
      phone: "09173615463",
      previous: "",
      allergies: "",
      current: "",
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <RegistryContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <RegistryHeader>
        <RegistryTitle>Registered Patients</RegistryTitle>
        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Patient Lastname / Firstname"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </RegistryHeader>

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Patient Number</TableHeader>
              <TableHeader>Last Name</TableHeader>
              <TableHeader>First Name</TableHeader>
              <TableHeader>Street</TableHeader>
              <TableHeader>Phone Number</TableHeader>
              <TableHeader>Previous</TableHeader>
              <TableHeader>Allergies</TableHeader>
              <TableHeader>Current</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              <TableRow
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.street}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.previous}</TableCell>
                <TableCell>{patient.allergies}</TableCell>
                <TableCell>{patient.current}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </RegistryContainer>
  )
}

export default PatientRegistry

