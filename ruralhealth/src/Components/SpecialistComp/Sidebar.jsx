import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, 
    Package, 
    Calendar, 
    LogOut, 
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

function Sidebar({ selectedMenu, setSelectedMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const iconSize = isCollapsed ? 28 : 24;

    return (
        <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <ChevronRight size={24} color="#000000" /> : <ChevronLeft size={24} color="#000000" />}
            </button>
            
            <div className="logo-container">
                {!isCollapsed && <div className="logo-text">Front Desk</div>}
            </div>

            <div className="sidebar-menu">
                <button 
                    className={`sidebar-button ${selectedMenu === 'examination' ? 'selected' : ''}`}
                    onClick={() => setSelectedMenu('examination')}
                    title="Dental Examination"
                >
                    <UserPlus size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Dental Examination</span>}
                </button>
                <button 
                    className={`sidebar-button ${selectedMenu === 'appointments' ? 'selected' : ''}`}
                    onClick={() => setSelectedMenu('appointments')}
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
                    color: #000000 !important; /* Set sidebar text to black */
                }
            `}</style>
        </div>
    );
}

export default Sidebar;