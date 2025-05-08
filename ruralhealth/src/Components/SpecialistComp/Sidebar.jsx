import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Sidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const iconSize = isCollapsed ? 28 : 24;

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <ChevronRight size={24} color="#000000" /> : <ChevronLeft size={24} color="#000000" />}
      </button>

      <div className="logo-container">
        {!isCollapsed && <div className="logo-text">Dentist</div>}
      </div>

      <div className="sidebar-menu">
        <button
          className={`sidebar-button ${activeView === 'examination' ? 'selected' : ''}`}
          onClick={() => setActiveView('examination')}
          title="Dental Examination"
        >
          <UserPlus size={iconSize} color="#000000" />
          {!isCollapsed && <span>Dental Examination</span>}
        </button>
        <button
          className={`sidebar-button ${activeView === 'appointments' ? 'selected' : ''}`}
          onClick={() => setActiveView('appointments')}
          title="Appointments"
        >
          <Calendar size={iconSize} color="#000000" />
          {!isCollapsed && <span>Appointments</span>}
        </button>
      </div>

      <div className="sidebar-footer">
        <button
          className="sidebar-button logout-button"
          title="Logout"
          onClick={() => navigate('/')}
        >
          <LogOut size={iconSize} color="#000000" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <style jsx>{`
        .logo-text,
        .sidebar-button span {
          color: #000000 !important;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;