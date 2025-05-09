import styled from "styled-components"
import Sidebar from "../../Components/AdminComp/Sidebar"
import PatientTable from "../../Components/AdminComp/PatientTable"
import { useState, useEffect } from "react"
import { FaBars, FaCalendarAlt } from "react-icons/fa"
import { getAllPatients } from "../../Firebase/patientOperations"
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../Firebase/firebase';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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

const MainContent = styled(motion.main)`
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

const Header = styled(motion.header)`
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

const DashboardTitle = styled(motion.h1)`
  font-size: 24px;
  color: #095D7E;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const Time = styled(motion.span)`
  color: #095D7E;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
`

const StatCard = styled(motion.div)`
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

const TableSection = styled(motion.section)`
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

const MenuButton = styled(motion.button)`
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

const TotalPatients = styled(motion.div)`
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

const SectionTitle = styled(motion.h2)`
  color: #095D7E;
`

const LoadingMessage = styled(motion.div)`
  text-align: center;
  color: #095D7E;
  font-size: 16px;
`

const GraphRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const GraphSection = styled(motion.section)`
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

  h2 {
    margin: 0 0 20px 0;
    color: #095D7E;
  }

  @media (max-width: 768px) {
    padding: 15px;
    overflow-x: auto;

    h2 {
      font-size: 18px;
    }
  }
`;

const GraphContainer = styled.div`
  height: 400px;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    height: 300px;
    min-width: 500px;
  }
`;

const AppointmentButton = styled(motion.button)`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  margin-left: auto;

  &:hover {
    background-color: #45a049;
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const BARANGAYS = [
  "Poblacion", "Compostela", "Legaspi", "Sta. Filomena", "Montpeller",
  "Madridejos", "Lepanto", "Valencia", "Guadalupe"
];

function BarangayStats() {
  const [counts, setCounts] = useState({});
  const [otherCount, setOtherCount] = useState(0);

  useEffect(() => {
    const patientsRef = ref(database, "rhp/patients");
    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      const tempCounts = {};
      let tempOther = 0;
      if (data) {
        Object.values(data).forEach((patient) => {
          const barangay = patient.address?.barangay?.trim() || "Other";
          if (BARANGAYS.includes(barangay)) {
            tempCounts[barangay] = (tempCounts[barangay] || 0) + 1;
          } else {
            tempOther += 1;
          }
        });
      }
      const finalCounts = {};
      BARANGAYS.forEach(b => finalCounts[b] = tempCounts[b] || 0);
      setCounts(finalCounts);
      setOtherCount(tempOther);
    });
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#095D7E', fontWeight: 600, marginBottom: 16 }}>Patient Registered From Different Barangays:</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {BARANGAYS.map(barangay => (
          <div key={barangay} style={{ minWidth: 120, background: "#f8fafc", borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 600, color: '#095D7E' }}>{barangay}</div>
            <div style={{ fontSize: 32, color: '#095D7E' }}>{counts[barangay]}</div>
          </div>
        ))}
        <div style={{ minWidth: 120, background: "#f8fafc", borderRadius: 8, padding: 16 }}>
          <div style={{ fontWeight: 600, color: '#095D7E' }}>Other</div>
          <div style={{ fontSize: 32, color: '#095D7E' }}>{otherCount}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    barangayStats: [],
    monthlyStats: []
  })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate();

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
    const patientsRef = ref(database, 'rhp/patients');
    const unsubscribe = onValue(patientsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        console.log('Real-time patient data update:', data);
        
        // Initialize counts for all barangays
        const barangayCounts = BARANGAY_LIST.reduce((acc, brgy) => {
          acc[brgy] = 0;
          return acc;
        }, {});

        // Initialize monthly counts for registrations and visits
        const monthlyRegistrations = Array(12).fill(0);
        const monthlyVisits = Array(12).fill(0);
        const currentYear = new Date().getFullYear();

        // Process patient data
        Object.entries(data || {}).forEach(([patientId, patient]) => {
          console.log(`Processing patient ${patientId}:`, patient);
          
          // Process barangay data (use address.barangay, fallback to contactInfo.address.barangay)
          const barangay = patient.address?.barangay || patient.contactInfo?.address?.barangay;
          if (barangay && barangay !== '') {
            if (BARANGAY_LIST.includes(barangay)) {
              barangayCounts[barangay] = (barangayCounts[barangay] || 0) + 1;
            } else {
              barangayCounts['Other'] = (barangayCounts['Other'] || 0) + 1;
            }
          } else {
            barangayCounts['Other'] = (barangayCounts['Other'] || 0) + 1;
          }

          // Process registration date
          try {
            if (patient.registrationInfo?.registrationDate) {
              const regDate = new Date(patient.registrationInfo.registrationDate);
              console.log(`Patient ${patientId} registration date:`, regDate);
              if (!isNaN(regDate.getTime())) {  // Check if date is valid
                if (regDate.getFullYear() === currentYear) {
                  monthlyRegistrations[regDate.getMonth()]++;
                  console.log(`Incrementing registration count for month ${regDate.getMonth() + 1} (${regDate.toLocaleString()})`);
                }
              }
            }
          } catch (error) {
            console.error(`Error processing registration date for patient ${patientId}:`, error);
          }

          // Process last visit date
          try {
            if (patient.registrationInfo?.lastVisit) {
              const visitDate = new Date(patient.registrationInfo.lastVisit);
              console.log(`Patient ${patientId} last visit date:`, visitDate);
              if (!isNaN(visitDate.getTime())) {  // Check if date is valid
                if (visitDate.getFullYear() === currentYear) {
                  monthlyVisits[visitDate.getMonth()]++;
                  console.log(`Incrementing visit count for month ${visitDate.getMonth() + 1} (${visitDate.toLocaleString()})`);
                }
              }
            }
          } catch (error) {
            console.error(`Error processing last visit date for patient ${patientId}:`, error);
          }
        });

        console.log('Final monthly registrations:', monthlyRegistrations);
        console.log('Final monthly visits:', monthlyVisits);
        console.log('Final barangay counts:', barangayCounts);

        // Update state with processed data
        setPatientStats({
          totalPatients: Object.keys(data || {}).length,
          barangayStats: barangayCounts,
          monthlyStats: {
            registrations: monthlyRegistrations,
            visits: monthlyVisits
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error processing patient data:', error);
        setLoading(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Bar chart data configuration
  const barChartData = {
    labels: BARANGAY_LIST,
    datasets: [
      {
        label: 'Number of Patients',
        data: BARANGAY_LIST.map(brgy => patientStats.barangayStats[brgy] || 0),
        backgroundColor: '#095D7E',
        borderColor: '#095D7E',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 50,
      },
    ],
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Line chart data configuration for visits
  const visitsChartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Patient Visits',
        data: patientStats.monthlyStats?.visits || Array(12).fill(0),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Update the existing line chart data for registrations
  const lineChartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Patient Registrations',
        data: patientStats.monthlyStats?.registrations || Array(12).fill(0),
        borderColor: '#4FC3F7',
        backgroundColor: 'rgba(79, 195, 247, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4FC3F7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Patients: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        title: {
          display: true,
          text: 'Number of Patients'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
  };

  const handleAppointmentClick = () => {
    navigate('/admin/appointments');
  };

  return (
    <DashboardContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MainContent 
        $isSidebarOpen={isSidebarOpen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MenuButton 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBars />
          </MenuButton>
          <DashboardTitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            DASHBOARD
          </DashboardTitle>
          <AppointmentButton
            onClick={handleAppointmentClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FaCalendarAlt />
            Manage Appointments
          </AppointmentButton>
          <Time
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {currentTime.toLocaleString('en-US', { 
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true 
            })}
          </Time>
        </Header>

        <TotalPatients
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2>Total Patients Registered</h2>
          <p>{loading ? "Loading..." : patientStats.totalPatients}</p>
        </TotalPatients>

        <GraphRow>
          <GraphSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2>Patient Distribution by Barangay</h2>
            <GraphContainer>
              {loading ? (
                <LoadingMessage
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Loading graph...
                </LoadingMessage>
              ) : (
                <Bar data={barChartData} options={chartOptions} />
              )}
            </GraphContainer>
          </GraphSection>

          <GraphSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h2>Monthly Patient Registration</h2>
            <GraphContainer>
              {loading ? (
                <LoadingMessage
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Loading graph...
                </LoadingMessage>
              ) : (
                <Line data={lineChartData} options={chartOptions} />
              )}
            </GraphContainer>
          </GraphSection>
        </GraphRow>

        <GraphSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h2>Monthly Patient Visits</h2>
          <GraphContainer>
            {loading ? (
              <LoadingMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Loading graph...
              </LoadingMessage>
            ) : (
              <Line data={visitsChartData} options={chartOptions} />
            )}
          </GraphContainer>
        </GraphSection>

        <TableSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <h2>Recent Patient Data Added:</h2>
          <PatientTable />
        </TableSection>
      </MainContent>
    </DashboardContainer>
  )
}
