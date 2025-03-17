import styled from "styled-components"

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

const Table = styled.table`
  width: 100%;
  min-width: 1000px;  
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
`

const Th = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
`

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #eee;
  white-space: nowrap;
`

const Tr = styled.tr`
  &:hover {
    background: #f9f9f9;
  }
`

const patientData = [
  {
    lastName: "Hyacinth",
    firstName: "Salve",
    middleName: "Acebuche",
    barangay: "Madridejos",
    phoneNumber: "0960053456",
    age: "20",
    birthdate: "3/29/2004",
    gender: "Female",
    registrationDate: "4/30/2024",
  },
  // Add more sample data as needed
]

export default function PatientTable() {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>Last Name</Th>
            <Th>First Name</Th>
            <Th>Middle Name</Th>
            <Th>Barangay</Th>
            <Th>Phone Number</Th>
            <Th>Age</Th>
            <Th>Birthdate</Th>
            <Th>Gender</Th>
            <Th>Registration Date</Th>
          </tr>
        </thead>
        <tbody>
          {patientData.map((patient, index) => (
            <Tr key={index}>
              <Td>{patient.lastName}</Td>
              <Td>{patient.firstName}</Td>
              <Td>{patient.middleName}</Td>
              <Td>{patient.barangay}</Td>
              <Td>{patient.phoneNumber}</Td>
              <Td>{patient.age}</Td>
              <Td>{patient.birthdate}</Td>
              <Td>{patient.gender}</Td>
              <Td>{patient.registrationDate}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  )
}

