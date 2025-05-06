import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Plus, 
    User, 
    LogOut, 
    ChevronLeft,
    ChevronRight
} from "lucide-react";

function Sidebar({ selectedButton, setSelectedButton, onCollapse }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const iconSize = isCollapsed ? 28 : 24;

    const handleLogout = () => {
        navigate("/");
    };

    const handleToggle = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onCollapse(newCollapsed);
    };

    return (
        <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={handleToggle}>
                {isCollapsed ? <ChevronRight size={24} color="#000000" /> : <ChevronLeft size={24} color="#000000" />}
            </button>
            
            <div className="logo-container">
                {!isCollapsed && <div className="logo-text">Doctor</div>}
            </div>

            <div className="sidebar-menu">
                <button 
                    className={`sidebar-button ${selectedButton === 'patientdiagnosis' ? 'selected' : ''}`}
                    onClick={() => setSelectedButton('patientdiagnosis')}
                    title="Patient Diagnosis"
                >
                    <Plus size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Patient Diagnosis</span>}
                </button>
                <button 
                    className={`sidebar-button ${selectedButton === 'appointments' ? 'selected' : ''}`}
                    onClick={() => setSelectedButton('appointments')}
                    title="Appointments"
                >
                    <User size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Appointments</span>}
                </button>
            </div>

            <div className="sidebar-footer">
                <button 
                    className="sidebar-button logout-button" 
                    title="Logout"
                    onClick={handleLogout}
                >
                    <LogOut size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>

            <style jsx>{`
                .sidebar-container {
                    height: 100vh;
                    background-color: #b2ebf2;
                    color: black;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                    width: ${isCollapsed ? '70px' : '260px'};
                    transition: width 0.5s ease;
                    overflow: hidden;
                    position: fixed;
                    left: 0;
                    top: 0;
                }

                .toggle-button {
                    align-self: flex-end;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 10px;
                    margin-bottom: 20px;
                    transition: background-color 0.3s ease;
                    border-radius: 6px;
                }

                .toggle-button:hover {
                    background-color: #26c6da;
                }

                .logo-container {
                    margin-bottom: 30px;
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .logo-text {
                    font-weight: bold;
                    font-size: 1.7rem;
                    letter-spacing: 1px;
                }

                .sidebar-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    width: 100%;
                    margin-top: 60px;
                }

                .sidebar-button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 18px;
                    background-color: #4dd0e1;
                    color: black;
                    border: 2px solid transparent;
                    border-radius: 10px;
                    cursor: pointer;
                    justify-content: ${isCollapsed ? 'center' : 'flex-start'};
                    transition: background-color 0.3s ease, border 0.3s ease;
                    outline: none;
                    font-size: 1rem;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
                }

                .sidebar-button:hover {
                    background-color: #26c6da;
                    border: 2px solid #26c6da;
                }

                .sidebar-button.selected {
                    background-color: #e0f7fa;
                    border: 2px solid #4dd0e1 !important;
                }

                .sidebar-footer {
                    margin-top: auto;
                    margin-bottom: 20px;
                    width: 100%;
                }

                .logout-button {
                    justify-content: ${isCollapsed ? 'center' : 'flex-start'};
                }

                .logo-text,
                .sidebar-button span {
                    color: #000000 !important;
                }
            `}</style>
        </div>
    );
}

export default Sidebar;
