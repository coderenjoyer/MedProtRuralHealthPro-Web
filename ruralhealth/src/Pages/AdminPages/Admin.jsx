import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import PatientTable from "../../Components/AdminComp/PatientTable"
import { useState, useEffect } from "react"
import { FaBars } from "react-icons/fa"
import { getAllPatients } from "../../Firebase/patientOperations"
import { useNavigate } from "react-router-dom"

const DashboardContainer = styled.div`
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
`

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px; 
  margin: 0 auto;
  margin-left: ${(props) => (props.$isSidebarOpen ? "200px" : "auto")};
  padding: 20px;
  transition: margin-left 0.3s ease;
  width: calc(100% - ${(props) => (props.$isSidebarOpen ? "200px" : "0")});
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
    width: 100%;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Title = styled.h1`
  font-size: 24px;
  color: #095D7E;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const Time = styled.span`
  color: #095D7E;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
`

const StatCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 5px 0;
    font-size: 14px;
    color: #095D7E;
  }

  p {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #095D7E;
  }

  @media (max-width: 768px) {
    padding: 10px;

    h3 {
      font-size: 12px;
    }

    p {
      font-size: 18px;
    }
  }
`

const TableSection = styled.section`
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  h2 {
    margin: 0 0 20px 0;
    color: #095D7E;
  }

  @media (max-width: 768px) {
    padding: 15px;

    h2 {
      font-size: 18px;
    }
  }
`

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #095D7E;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`

const TotalPatients = styled.div`
  background: #095D7E;
  color: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 16px;
  }

  p {
    margin: 5px 0 0;
    font-size: 28px;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    padding: 10px;

    h2 {
      font-size: 14px;
    }

    p {
      font-size: 24px;
    }
  }
`

const SectionTitle = styled.h2`
  color: #095D7E;
`

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

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    barangayStats: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRetrying, setIsRetrying] = useState(false)
  const navigate = useNavigate()

  const BARANGAY_LIST = [
    "Poblacion",
    "Compostela",
    "Legaspi",
    "Sta. Filomena",
    "Montpeller",
    "Madridejos",
    "Lepanto",
    "Valencia",
    "Guadalupe",
    "Other"
  ]

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

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchPatientStats = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsRetrying(false)

      const result = await getAllPatients()
      if (!result) {
        throw new Error('No response received from server')
      }

      if (result.success) {
        // Initialize counts for all barangays
        const barangayCounts = BARANGAY_LIST.reduce((acc, brgy) => {
          acc[brgy] = 0
          return acc
        }, {})

        // Count patients per barangay
        Object.values(result.data || {}).forEach(patient => {
          if (!patient || typeof patient !== 'object') {
            console.warn('Invalid patient data:', patient)
            return
          }

          const barangay = patient.contactInfo?.address?.barangay
          if (barangay && barangay !== '') {
            if (BARANGAY_LIST.includes(barangay)) {
              barangayCounts[barangay] = (barangayCounts[barangay] || 0) + 1
            } else {
              barangayCounts['Other'] = (barangayCounts['Other'] || 0) + 1
            }
          } else {
            barangayCounts['Other'] = (barangayCounts['Other'] || 0) + 1
          }
        })

        // Convert to array format for display
        const barangayStats = Object.entries(barangayCounts).map(([barangay, count]) => ({
          barangay,
          count
        }))

        setPatientStats({
          totalPatients: Object.values(barangayCounts).reduce((a, b) => a + b, 0),
          barangayStats
        })
      } else {
        throw new Error(result.message || 'Failed to fetch patient data')
      }
    } catch (error) {
      console.error('Error fetching patient stats:', error)
      setError(error.message || 'Failed to load patient statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatientStats()
  }, [])

  const handleRetry = () => {
    setIsRetrying(true)
    fetchPatientStats()
  }

  if (error) {
    return (
      <DashboardContainer>
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <MainContent $isSidebarOpen={isSidebarOpen}>
          <ErrorMessage>
            {error}
            <p>Redirecting to login...</p>
          </ErrorMessage>
        </MainContent>
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <Header>
          <Title>Admin Dashboard</Title>
          <Time>{currentTime.toLocaleTimeString()}</Time>
          <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </MenuButton>
        </Header>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <p>Loading dashboard data...</p>
          </LoadingContainer>
        ) : (
          <>
            <StatsGrid>
              <StatCard>
                <h3>Total Patients</h3>
                <p>{patientStats.totalPatients}</p>
              </StatCard>
              {patientStats.barangayStats.map((stat, index) => (
                <StatCard key={index}>
                  <h3>{stat.barangay}</h3>
                  <p>{stat.count}</p>
                </StatCard>
              ))}
            </StatsGrid>

            <TableSection>
              <SectionTitle>Recent Patients</SectionTitle>
              <PatientTable />
            </TableSection>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  )
}
