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
    X,
    HelpCircle
} from 'lucide-react';
import styled from 'styled-components';
import { ref, onValue, update, push } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';

// Custom tooltip component
const TooltipContainer = styled.div`
    position: absolute;
    background-color: #000000;
    color: #ffffff;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 1100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    left: ${({ isCollapsed }) => isCollapsed ? '70px' : '260px'};
    transform: translateY(-50%);
    
    &:before {
        content: "";
        position: absolute;
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
        border-width: 6px 6px 6px 0;
        border-style: solid;
        border-color: transparent #000000 transparent transparent;
    }
`;

const TooltipTrigger = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
`;

const HelpIconWrapper = styled.button`
    background: none;
    border: none;
    cursor: help;
    padding: 0;
    margin-left: 8px;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
        opacity: 1;
    }
`;

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

// Tooltip component
function Tooltip({ children, content, isVisible, isCollapsed }) {
    return (
        <TooltipTrigger>
            {children}
            <TooltipContainer 
                style={{ opacity: isVisible ? 1 : 0 }}
                isCollapsed={isCollapsed}
            >
                {content}
            </TooltipContainer>
        </TooltipTrigger>
    );
}

function Sidebar({ selectedMenu, setSelectedMenu, onCollapse }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const iconSize = isCollapsed ? 28 : 24;
    const [isEditing, setIsEditing] = useState(false);
    const [frontdeskName, setFrontdeskName] = useState('Front Desk');
    const [tempName, setTempName] = useState('');
    const [activeTooltip, setActiveTooltip] = useState(null);

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

    const showTooltip = (tooltipId) => {
        setActiveTooltip(tooltipId);
    };

    const hideTooltip = () => {
        setActiveTooltip(null);
    };

    return (
        <SidebarContainer isCollapsed={isCollapsed}>
            <Tooltip 
                content="Toggle sidebar expansion" 
                isVisible={activeTooltip === 'toggle'} 
                isCollapsed={isCollapsed}
            >
                <ToggleButton 
                    onClick={handleToggle}
                    onMouseEnter={() => showTooltip('toggle')}
                    onMouseLeave={hideTooltip}
                >
                    {isCollapsed ? <ChevronRight size={24} color="#000000" /> : <ChevronLeft size={24} color="#000000" />}
                </ToggleButton>
            </Tooltip>
            
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
                                    <Tooltip 
                                        content="Save name changes" 
                                        isVisible={activeTooltip === 'save'} 
                                        isCollapsed={isCollapsed}
                                    >
                                        <ActionButton 
                                            onClick={handleSave} 
                                            onMouseEnter={() => showTooltip('save')}
                                            onMouseLeave={hideTooltip}
                                        >
                                            <Check size={16} />
                                        </ActionButton>
                                    </Tooltip>
                                    <Tooltip 
                                        content="Cancel editing" 
                                        isVisible={activeTooltip === 'cancel'} 
                                        isCollapsed={isCollapsed}
                                    >
                                        <ActionButton 
                                            onClick={handleCancel} 
                                            onMouseEnter={() => showTooltip('cancel')}
                                            onMouseLeave={hideTooltip}
                                        >
                                            <X size={16} />
                                        </ActionButton>
                                    </Tooltip>
                                </ActionButtons>
                            </>
                        ) : (
                            <>
                                {frontdeskName}
                                <Tooltip 
                                    content="Edit your display name" 
                                    isVisible={activeTooltip === 'edit'} 
                                    isCollapsed={isCollapsed}
                                >
                                    <EditButton 
                                        onClick={handleEditClick} 
                                        onMouseEnter={() => showTooltip('edit')}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <Edit2 size={16} />
                                    </EditButton>
                                </Tooltip>
                            </>
                        )}
                    </LogoText>
                )}
            </LogoContainer>

            <SidebarMenu>
                <Tooltip 
                    content="Add new patients or update existing records" 
                    isVisible={activeTooltip === 'register' && isCollapsed}
                    isCollapsed={isCollapsed}
                >
                    <SidebarButton 
                        isCollapsed={isCollapsed}
                        className={selectedMenu === 'register' ? 'selected' : ''}
                        onClick={() => setSelectedMenu('register')}
                        onMouseEnter={() => showTooltip('register')}
                        onMouseLeave={hideTooltip}
                    >
                        <UserPlus size={iconSize} color="#000000" />
                        {!isCollapsed && (
                            <>
                                <span>Register Patient</span>
                                {activeTooltip !== 'register-help' && (
                                    <HelpIconWrapper
                                        onMouseEnter={(e) => {
                                            e.stopPropagation();
                                            showTooltip('register-help');
                                        }}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <HelpCircle size={16} />
                                    </HelpIconWrapper>
                                )}
                            </>
                        )}
                    </SidebarButton>
                </Tooltip>
                {activeTooltip === 'register-help' && !isCollapsed && (
                    <TooltipContainer 
                        style={{ 
                            opacity: 1, 
                            top: '270px', 
                            left: '100px', 
                            maxWidth: '250px',
                            whiteSpace: 'normal'
                        }}
                    >
                        Register new patients with their personal and medical information. You can also search for and update existing patient records.
                    </TooltipContainer>
                )}

                <Tooltip 
                    content="Manage medicine stock and supplies" 
                    isVisible={activeTooltip === 'inventory' && isCollapsed}
                    isCollapsed={isCollapsed}
                >
                    <SidebarButton 
                        isCollapsed={isCollapsed}
                        className={selectedMenu === 'inventory' ? 'selected' : ''}
                        onClick={() => setSelectedMenu('inventory')}
                        onMouseEnter={() => showTooltip('inventory')}
                        onMouseLeave={hideTooltip}
                    >
                        <Package size={iconSize} color="#000000" />
                        {!isCollapsed && (
                            <>
                                <span>Manage Inventory</span>
                                {activeTooltip !== 'inventory-help' && (
                                    <HelpIconWrapper
                                        onMouseEnter={(e) => {
                                            e.stopPropagation();
                                            showTooltip('inventory-help');
                                        }}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <HelpCircle size={16} />
                                    </HelpIconWrapper>
                                )}
                            </>
                        )}
                    </SidebarButton>
                </Tooltip>
                {activeTooltip === 'inventory-help' && !isCollapsed && (
                    <TooltipContainer 
                        style={{ 
                            opacity: 1, 
                            top: '330px', 
                            left: '100px', 
                            maxWidth: '250px',
                            whiteSpace: 'normal'
                        }}
                    >
                        Track and manage medical supplies and medications. Monitor stock levels, expiration dates, and add/remove items from inventory.
                    </TooltipContainer>
                )}

                <Tooltip 
                    content="Schedule and manage patient appointments" 
                    isVisible={activeTooltip === 'appointments' && isCollapsed}
                    isCollapsed={isCollapsed}
                >
                    <SidebarButton 
                        isCollapsed={isCollapsed}
                        className={selectedMenu === 'appointments' ? 'selected' : ''}
                        onClick={() => setSelectedMenu('appointments')}
                        onMouseEnter={() => showTooltip('appointments')}
                        onMouseLeave={hideTooltip}
                    >
                        <Calendar size={iconSize} color="#000000" />
                        {!isCollapsed && (
                            <>
                                <span>Appointments</span>
                                {activeTooltip !== 'appointments-help' && (
                                    <HelpIconWrapper
                                        onMouseEnter={(e) => {
                                            e.stopPropagation();
                                            showTooltip('appointments-help');
                                        }}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <HelpCircle size={16} />
                                    </HelpIconWrapper>
                                )}
                            </>
                        )}
                    </SidebarButton>
                </Tooltip>
                {activeTooltip === 'appointments-help' && !isCollapsed && (
                    <TooltipContainer 
                        style={{ 
                            opacity: 1, 
                            top: '390px', 
                            left: '100px', 
                            maxWidth: '250px',
                            whiteSpace: 'normal'
                        }}
                    >
                        Schedule patient appointments with doctors. View, modify, or cancel upcoming appointments and manage the clinic's calendar.
                    </TooltipContainer>
                )}
            </SidebarMenu>

            <SidebarFooter>
                <Tooltip 
                    content="Log out of the system" 
                    isVisible={activeTooltip === 'logout' && isCollapsed}
                    isCollapsed={isCollapsed}
                >
                    <SidebarButton 
                        isCollapsed={isCollapsed}
                        onClick={handleLogout}
                        onMouseEnter={() => showTooltip('logout')}
                        onMouseLeave={hideTooltip}
                    >
                        <LogOut size={iconSize} color="#000000" />
                        {!isCollapsed && <span>Logout</span>}
                    </SidebarButton>
                </Tooltip>
            </SidebarFooter>
        </SidebarContainer>
    );
}

export default Sidebar;