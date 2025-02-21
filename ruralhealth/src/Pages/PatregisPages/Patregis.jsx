import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../styles/doc'
import React, { useState } from 'react';
import Sidebar from '../../Components/PatRegisComp/PatSidebar'; // sidebar
import PatientRegistry from '../../Components/PatRegisComp/PatRegistry'; // patregistry
import ManageInventory from '../../Components/PatRegisComp/PatInventory'; // inventory
import Appointments from '../../Components/PatRegisComp/PatAppo'; //appointments

function Main() {
  const [selectedMenu, setSelectedMenu] = useState('register');

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
    <div className="wrapper">
      <Sidebar 
        selectedMenu={selectedMenu} 
        setSelectedMenu={setSelectedMenu} 
      />
      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
