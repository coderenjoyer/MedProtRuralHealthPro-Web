
import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import PatientTable from "../../Components/AdminComp/PatientTable"
import { useState } from "react"
import { FaBars } from "react-icons/fa"

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
  margin-left: ${(props) => (props.$isSidebarOpen ? "200px" : "0")};
  padding: 20px;
  transition: margin-left 0.3s ease;
  width: calc(100% - ${(props) => (props.$isSidebarOpen ? "200px" : "0")});
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
    width: 100%;
  }
`

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
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const Time = styled.span`
  color: #666;

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
    color: #666;
  }

  p {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #333;
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
    color: #333;
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
  color: #333;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`

const TotalPatients = styled.div`
  background: #004b87;
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
  color: black;
`

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const barangayStats = [
    { name: "Madridejos", count: 1 },
    { name: "Legaspi", count: 0 },
    { name: "Montpeller", count: 0 },
    { name: "Other", count: 1 },
    { name: "Poblacion", count: 2 },
    { name: "Guadalupe", count: 0 },
    { name: "Sta. Filomena", count: 0 },
    { name: "Valencia", count: 1 },
  ]

  const totalPatients = barangayStats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <Header>
          <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </MenuButton>
          <Title>DASHBOARD</Title>
          <Time>Saturday 9:47:00 AM</Time>
        </Header>

        <TotalPatients>
          <h2>Total Patients Registered</h2>
          <p>{totalPatients}</p>
        </TotalPatients>

        <SectionTitle>Patient Registered From Different Barangays:</SectionTitle>
        <StatsGrid>
          {barangayStats.map((stat, index) => (
            <StatCard key={index}>
              <h3>{stat.name}</h3>
              <p>{stat.count}</p>
            </StatCard>
          ))}
        </StatsGrid>

        <TableSection>
          <h2>Recent Patient Data Added:</h2>
          <PatientTable />
        </TableSection>
      </MainContent>
    </DashboardContainer>
  )
}
