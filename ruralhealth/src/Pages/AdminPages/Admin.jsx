import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import PatientTable from "../../Components/AdminComp/PatientTable"
import { useState, useEffect } from "react"
import { FaBars } from "react-icons/fa"
import { getAllPatients } from "../../Firebase/patientOperations"

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
  max-width: 1200px; /* ✅ Restrict max width */
  margin: 0 auto; /* ✅ Center horizontally */
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

const LoadingMessage = styled.div`
  text-align: center;
  color: #095D7E;
  font-size: 16px;
`

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    barangayStats: []
  })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

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

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchPatientStats = async () => {
      try {
        const result = await getAllPatients()
        if (result.success) {
          console.log('Fetched patient data:', result.data)
          
          // Initialize counts for all barangays
          const barangayCounts = BARANGAY_LIST.reduce((acc, brgy) => {
            acc[brgy] = 0
            return acc
          }, {})

          // Count patients per barangay
          Object.values(result.data || {}).forEach(patient => {
            console.log('Processing patient:', patient)
            const barangay = patient.contactInfo?.address?.barangay
            console.log('Patient barangay:', barangay)
            
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

          console.log('Barangay counts:', barangayCounts)

          // Convert to array format for display
          const barangayStats = BARANGAY_LIST.map(name => ({
            name,
            count: barangayCounts[name] || 0
          }))

          console.log('Final stats:', barangayStats)

          setPatientStats({
            totalPatients: Object.keys(result.data || {}).length,
            barangayStats: barangayStats
          })
        }
      } catch (error) {
        console.error('Error fetching patient statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientStats()
  }, [])

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <Header>
          <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </MenuButton>
          <Title>DASHBOARD</Title>
          <Time>
            {currentTime.toLocaleString('en-US', { 
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true 
            })}
          </Time>
        </Header>

        <TotalPatients>
          <h2>Total Patients Registered</h2>
          <p>{loading ? "Loading..." : patientStats.totalPatients}</p>
        </TotalPatients>

        <SectionTitle>Patient Registered From Different Barangays:</SectionTitle>
        <StatsGrid>
          {loading ? (
            <LoadingMessage>Loading statistics...</LoadingMessage>
          ) : (
            patientStats.barangayStats.map((stat, index) => (
              <StatCard key={index}>
                <h3>{stat.name}</h3>
                <p>{stat.count}</p>
              </StatCard>
            ))
          )}
        </StatsGrid>

        <TableSection>
          <h2>Recent Patient Data Added:</h2>
          <PatientTable />
        </TableSection>
      </MainContent>
    </DashboardContainer>
  )
}
