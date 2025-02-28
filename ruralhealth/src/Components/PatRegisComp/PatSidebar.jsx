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
    const navigate = useNavigate(); // Initialize navigate function
    const iconSize = isCollapsed ? 28 : 24;

    return (
        <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
            
            <div className="logo-container">
                <div className="profile-circle">
                    <img src="/placeholder.jpg" alt="Profile" className="profile-image" />
                </div>
                {!isCollapsed && <div className="logo-text">Front Desk</div>}
            </div>

            <div className="sidebar-menu">
                <button 
                    className={`sidebar-button ${selectedMenu === 'register' ? 'selected' : ''}`}
                    onClick={() => setSelectedMenu('register')}
                    title="Register Patient"
                >
                    <UserPlus size={iconSize} />
                    {!isCollapsed && <span>Register Patient</span>}
                </button>
                <button 
                    className={`sidebar-button ${selectedMenu === 'inventory' ? 'selected' : ''}`}
                    onClick={() => setSelectedMenu('inventory')}
                    title="Manage Inventory"
                >
                    <Package size={iconSize} />
                    {!isCollapsed && <span>Manage Inventory</span>}
                </button>
                <button 
                    className={`sidebar-button ${selectedMenu === 'appointments' ? 'selected' : ''}`}
                    onClick={() => setSelectedMenu('appointments')}
                    title="Appointments"
                >
                    <Calendar size={iconSize} />
                    {!isCollapsed && <span>Appointments</span>}
                </button>
            </div>

            <div className="sidebar-footer">
                <button 
                    className="sidebar-button logout-button" 
                    title="Logout"
                    onClick={() => navigate('/')} // Navigate to home page on logout
                >
                    <LogOut size={iconSize} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
