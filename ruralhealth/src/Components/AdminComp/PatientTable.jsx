import styled from "styled-components"
import { useEffect, useState, useMemo } from "react"
import { getAllPatients } from "../../Firebase/patientOperations"

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
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
  position: sticky;
  top: 0;
  z-index: 1;
`

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #eee;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin: 1rem 0;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #095D7E;
    box-shadow: 0 0 0 2px rgba(9, 93, 126, 0.2);
  }
`

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
`

export default function PatientTable() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dataLoadError, setDataLoadError] = useState(false)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)
        setDataLoadError(false)

        const result = await getAllPatients()
        
        if (!result) {
          throw new Error('No response received from server')
        }

        if (result.success) {
          // Validate and transform the data
          const patientsArray = Object.entries(result.data || {})
            .map(([id, patient]) => {
              // Validate required fields
              if (!patient.personalInfo || !patient.registrationInfo) {
                console.warn(`Patient ${id} is missing required information`)
              }

              return {
                id,
                ...patient.personalInfo,
                barangay: patient.contactInfo?.address?.barangay || 'N/A',
                phoneNumber: patient.contactInfo?.contactNumber || 'N/A',
                registrationDate: patient.registrationInfo?.registrationDate || 'N/A'
              }
            })
            .filter(patient => {
              // Filter out invalid entries
              return patient.firstName && patient.lastName
            })
            .sort((a, b) => {
              // Sort in descending order (most recent first)
              const dateA = new Date(a.registrationDate)
              const dateB = new Date(b.registrationDate)
              return dateB - dateA
            })

          setPatients(patientsArray)
        } else {
          throw new Error(result.message || 'Failed to fetch patients')
        }
      } catch (err) {
        console.error('Error fetching patients:', err)
        setError(err.message || 'Failed to fetch patients')
        setDataLoadError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Memoized filtered patients
  const filteredPatients = useMemo(() => {
    try {
      if (!searchTerm.trim()) return patients

      const searchLower = searchTerm.toLowerCase()
      return patients.filter(patient => {
        return (
          patient.firstName?.toLowerCase().includes(searchLower) ||
          patient.lastName?.toLowerCase().includes(searchLower) ||
          patient.middleName?.toLowerCase().includes(searchLower) ||
          patient.barangay?.toLowerCase().includes(searchLower) ||
          patient.phoneNumber?.includes(searchTerm)
        )
      })
    } catch (error) {
      console.error('Error filtering patients:', error)
      return []
    }
  }, [patients, searchTerm])

  // Handle search input with validation
  const handleSearch = (e) => {
    try {
      const value = e.target.value
      // Sanitize input - only allow alphanumeric characters, spaces, and basic punctuation
      const sanitizedValue = value.replace(/[^A-Za-z0-9\s\-'\.]/g, '')
      setSearchTerm(sanitizedValue)
    } catch (error) {
      console.error('Error handling search:', error)
      setError('Error processing search input')
    }
  }

  if (loading) {
    return <LoadingMessage>Loading patients...</LoadingMessage>
  }

  if (dataLoadError) {
    return (
      <ErrorMessage>
        Error loading patient data. Please try refreshing the page.
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#095D7E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </ErrorMessage>
    )
  }

  return (
    <TableWrapper>
      <SearchInput
        type="text"
        placeholder="Search patients..."
        value={searchTerm}
        onChange={handleSearch}
        maxLength="50"
      />
      
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
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Tr key={patient.id}>
                <Td>{patient.lastName || 'N/A'}</Td>
                <Td>{patient.firstName || 'N/A'}</Td>
                <Td>{patient.middleName || 'N/A'}</Td>
                <Td>{patient.barangay}</Td>
                <Td>{patient.phoneNumber}</Td>
                <Td>
                  {patient.registrationDate !== 'N/A' 
                    ? new Date(patient.registrationDate).toLocaleDateString()
                    : 'N/A'
                  }
                </Td>
              </Tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                <NoResults>No patients found</NoResults>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableWrapper>
  )
}

