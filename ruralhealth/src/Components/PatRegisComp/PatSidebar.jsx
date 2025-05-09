import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, 
    Package, 
    Calendar, 
    LogOut, 
    ChevronLeft,
    ChevronRight,
    Edit2,
    Check,
    X
} from 'lucide-react';
import styled from 'styled-components';
import { ref, onValue, update, push } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';

const SidebarContainer = styled.div`
    height: 100vh;
    background-color: #b2ebf2;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    width: ${({ isCollapsed }) => isCollapsed ? '70px' : '260px'};
    transition: width 0.5s ease;
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 0;
`;

const ToggleButton = styled.button`
    align-self: flex-end;
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;
    border-radius: 6px;

    &:hover {
        background-color: #26c6da;
    }
`;

const LogoContainer = styled.div`
    margin-bottom: 30px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const LogoText = styled.div`
    font-weight: bold;
    font-size: 1.7rem;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const EditButton = styled.button`
    background: none;
    border: none;
    color: black;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const NameInput = styled.input`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    color: black;
    padding: 0.25rem 0.5rem;
    font-size: 1.7rem;
    font-weight: bold;
    width: 120px;
    text-align: center;

    &:focus {
        outline: none;
        border-color: rgba(0, 0, 0, 0.5);
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.25rem;
    margin-left: 0.5rem;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: black;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const SidebarMenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    margin-top: 60px;
`;

const SidebarButton = styled.button`
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
    justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
    transition: background-color 0.3s ease, border 0.3s ease;
    outline: none;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);

    span {
        color: black;
    }

    &:hover {
        background-color: #26c6da;
        border: 2px solid #000000;
        span {
            color: black;
        }
    }

    &.selected {
        background-color: #e0f7fa;
        border: 2px solid #000000 !important;
        span {
            color: black;
        }
    }
`;

const SidebarFooter = styled.div`
    margin-top: auto;
    margin-bottom: 20px;
    width: 100%;
`;

function Sidebar({ selectedMenu, setSelectedMenu, onCollapse }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const iconSize = isCollapsed ? 28 : 24;
    const [isEditing, setIsEditing] = useState(false);
    const [frontdeskName, setFrontdeskName] = useState('Front Desk');
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        // Load frontdesk name from database
        const userRef = ref(database, 'rhp/users');
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Find the current user's data
                const currentUser = Object.values(data).find(user => user.role === 'frontdesk');
                if (currentUser) {
                    setFrontdeskName(currentUser.personName || 'Front Desk');
                }
            }
        });
    }, []);

    const handleEditClick = () => {
        setTempName(frontdeskName);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const userRef = ref(database, 'rhp/users');
            onValue(userRef, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Find the current user's key
                    const userKey = Object.keys(data).find(key => data[key].role === 'frontdesk');
                    if (userKey) {
                        // Update existing user
                        await update(ref(database, `rhp/users/${userKey}`), {
                            personName: tempName
                        });
                    } else {
                        // Create new user if not found
                        const newUserRef = push(userRef);
                        await update(newUserRef, {
                            role: 'frontdesk',
                            personName: tempName,
                            createdAt: new Date().toISOString()
                        });
                    }
                    setFrontdeskName(tempName);
                    toast.success('Name updated successfully');
                } else {
                    // Initialize users collection if it doesn't exist
                    const newUserRef = push(userRef);
                    await update(newUserRef, {
                        role: 'frontdesk',
                        personName: tempName,
                        createdAt: new Date().toISOString()
                    });
                    setFrontdeskName(tempName);
                    toast.success('Name initialized successfully');
                }
            });
        } catch (error) {
            console.error('Error updating name:', error);
            toast.error('Failed to update name');
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempName(frontdeskName);
        setIsEditing(false);
    };

    const handleLogout = () => {
        navigate("/");
    };

    const handleToggle = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onCollapse(newCollapsed);
    };

    return (
        <SidebarContainer isCollapsed={isCollapsed}>
            <ToggleButton onClick={handleToggle}>
                {isCollapsed ? <ChevronRight size={24} color="#000000" /> : <ChevronLeft size={24} color="#000000" />}
            </ToggleButton>
            
            <LogoContainer>
                {!isCollapsed && (
                    <LogoText>
                        {isEditing ? (
                            <>
                                <NameInput
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                                />
                                <ActionButtons>
                                    <ActionButton onClick={handleSave} title="Save">
                                        <Check size={16} />
                                    </ActionButton>
                                    <ActionButton onClick={handleCancel} title="Cancel">
                                        <X size={16} />
                                    </ActionButton>
                                </ActionButtons>
                            </>
                        ) : (
                            <>
                                {frontdeskName}
                                <EditButton onClick={handleEditClick} title="Edit name">
                                    <Edit2 size={16} />
                                </EditButton>
                            </>
                        )}
                    </LogoText>
                )}
            </LogoContainer>

            <SidebarMenu>
                <SidebarButton 
                    isCollapsed={isCollapsed}
                    className={selectedMenu === 'register' ? 'selected' : ''}
                    onClick={() => setSelectedMenu('register')}
                    title="Register Patient"
                >
                    <UserPlus size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Register Patient</span>}
                </SidebarButton>
                <SidebarButton 
                    isCollapsed={isCollapsed}
                    className={selectedMenu === 'inventory' ? 'selected' : ''}
                    onClick={() => setSelectedMenu('inventory')}
                    title="Manage Inventory"
                >
                    <Package size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Manage Inventory</span>}
                </SidebarButton>
                <SidebarButton 
                    isCollapsed={isCollapsed}
                    className={selectedMenu === 'appointments' ? 'selected' : ''}
                    onClick={() => setSelectedMenu('appointments')}
                    title="Appointments"
                >
                    <Calendar size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Appointments</span>}
                </SidebarButton>
            </SidebarMenu>

            <SidebarFooter>
                <SidebarButton 
                    isCollapsed={isCollapsed}
                    onClick={handleLogout}
                    title="Logout"
                >
                    <LogOut size={iconSize} color="#000000" />
                    {!isCollapsed && <span>Logout</span>}
                </SidebarButton>
            </SidebarFooter>
        </SidebarContainer>
    );
}

export default Sidebar;