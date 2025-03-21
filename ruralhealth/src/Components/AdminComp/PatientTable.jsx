import styled from "styled-components"
import { useEffect, useState } from "react"
import { getAllPatients } from "../../Firebase/patientOperations"

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
  background: #095D7E;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: white;
  white-space: nowrap;
`

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #eee;
  white-space: nowrap;
`

const Tr = styled.tr`
  &:hover {
    background: rgba(9, 93, 126, 0.1);
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #095D7E;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #095D7E;
`

export default function PatientTable() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await getAllPatients()
        if (result.success) {
          // Convert the object of patients into an array and sort by registration date
          const patientsArray = Object.entries(result.data || {})
            .map(([id, patient]) => ({
              id,
              ...patient.personalInfo,
              barangay: patient.contactInfo?.address?.barangay || '',
              phoneNumber: patient.contactInfo?.contactNumber || '',
              registrationDate: patient.registrationInfo?.registrationDate || ''
            }))
            .sort((a, b) => {
              // Sort in descending order (most recent first)
              return new Date(b.registrationDate) - new Date(a.registrationDate)
            })
          setPatients(patientsArray)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError('Failed to fetch patients')
        console.error('Error fetching patients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  if (loading) {
    return <LoadingMessage>Loading patients...</LoadingMessage>
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

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
            <Th>Registration Date</Th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <Tr key={patient.id}>
              <Td>{patient.lastName}</Td>
              <Td>{patient.firstName}</Td>
              <Td>{patient.middleName}</Td>
              <Td>{patient.barangay}</Td>
              <Td>{patient.phoneNumber}</Td>
              <Td>{new Date(patient.registrationDate).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  )
}

