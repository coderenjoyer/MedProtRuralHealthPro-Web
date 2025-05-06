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

function Sidebar({ selectedMenu, setSelectedMenu, isCollapsed, setIsCollapsed }) {
    const navigate = useNavigate();
    const iconSize = isCollapsed ? 28 : 24;

    return (
        <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <ChevronRight size={24} color="#000000" /> : <ChevronLeft size={24} color="#000000" />}
            </button>
            
            <div className="logo-container">
                {!isCollapsed && <div className="logo-text">Dental Specialist</div>}
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
                .sidebar-container {
                    position: fixed;
                    left: 0;
                    top: 0;
                    height: 100vh;
                    width: 260px;
                    background-color: white;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                    transition: width 0.3s ease;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-container.collapsed {
                    width: 70px;
                }

                .toggle-button {
                    position: absolute;
                    right: -12px;
                    top: 20px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                    z-index: 1001;
                }

                .logo-container {
                    padding: 2rem 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .logo-text {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #000000;
                }

                .sidebar-menu {
                    flex: 1;
                    padding: 1rem 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .sidebar-button {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: none;
                    border: none;
                    width: 100%;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    color: #000000;
                }

                .sidebar-button:hover {
                    background-color: #f3f4f6;
                }

                .sidebar-button.selected {
                    background-color: #e5e7eb;
                    font-weight: 600;
                }

                .sidebar-button span {
                    font-size: 1rem;
                    white-space: nowrap;
                }

                .sidebar-footer {
                    padding: 1rem 0;
                    border-top: 1px solid #e5e7eb;
                }

                .logout-button {
                    color: #ef4444;
                }

                .logout-button:hover {
                    background-color: #fee2e2;
                }
            `}</style>
        </div>
    );
}

export default Sidebar;