import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../styles/doc.css'
import React, { useState } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../Components/PatRegisComp/PatSidebar'; // sidebar
import PatientRegistry from '../../Components/PatRegisComp/PatRegistry'; // patregistry
import ManageInventory from '../../Components/PatRegisComp/PatInventory'; // inventory
import Appointments from '../../Components/PatRegisComp/PatAppo'; //appointments

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #e0f7fa;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${({ $isCollapsed }) => $isCollapsed ? '70px' : '260px'};
  transition: margin-left 0.5s ease;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
`;

const ContentWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

function Main() {
  const [selectedMenu, setSelectedMenu] = useState('register');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'register':
        return <PatientRegistry />;
      case 'inventory':
        return <ManageInventory />;
      case 'appointments':
        return <Appointments />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <Wrapper>
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
      <Sidebar 
        selectedMenu={selectedMenu} 
        setSelectedMenu={setSelectedMenu}
        onCollapse={handleSidebarCollapse}
      />
      <ContentContainer $isCollapsed={isCollapsed}>
        <AnimatePresence mode="wait">
          <ContentWrapper
            key={selectedMenu}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </ContentWrapper>
        </AnimatePresence>
      </ContentContainer>
    </Wrapper>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)

export default Main;
