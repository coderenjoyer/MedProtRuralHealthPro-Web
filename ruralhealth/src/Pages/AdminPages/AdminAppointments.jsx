import styled from "styled-components";
import Sidebar from "../../Components/AdminComp/Sidebar";
import AppointmentTable from "../../Components/AdminComp/AppointmentTable";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
  position: relative;
`;

const MainContent = styled(motion.main)`
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
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled(motion.h1)`
  font-size: 24px;
  color: #095D7E;
  margin: 0;
`;

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
`;

const ContentSection = styled(motion.section)`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default function AdminAppointments() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <PageContainer>
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
          <Title
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Manage Appointments
          </Title>
        </Header>

        <ContentSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AppointmentTable />
        </ContentSection>
      </MainContent>
    </PageContainer>
  );
} 