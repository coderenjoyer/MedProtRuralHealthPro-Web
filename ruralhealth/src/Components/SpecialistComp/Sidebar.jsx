import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
  HelpCircle,
  Info
} from 'lucide-react';
import styled from "styled-components";
import { ref, onValue, update, push } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';

// Tooltip styled components
const TooltipContainer = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  max-width: 300px;
  z-index: 1100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  white-space: normal;
`;

const HelpButton = styled.button`
  background: none;
  border: none;
  cursor: help;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  color: #0288d1;
  
  &:hover {
    color: #01579b;
  }
`;

export const SidebarContainer = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? "56px" : "240px")};
  transition: width 0.3s;
  background: #4FC3F7;
  min-height: 100vh;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  z-index: 2;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 20px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #4FC3F7;
  border: 1px solid #81D4FA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  color: white;

  &:hover {
    background: #29B6F6;
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(4px);
  }
`;

const LogoContainer = styled.div`
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
`;

const LogoText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
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
  font-size: 1.25rem;
  font-weight: 600;
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
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  border: none;
  background: ${({ isActive }) => isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: black;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: black;
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

function Sidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const iconSize = isCollapsed ? 28 : 24;
  const [isEditing, setIsEditing] = useState(false);
  const [dentistName, setDentistName] = useState('Dentist');
  const [tempName, setTempName] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    // Load dentist name from database
    const userRef = ref(database, 'rhp/users');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Find the current user's data
        const currentUser = Object.values(data).find(user => user.role === 'dentist');
        if (currentUser) {
          setDentistName(currentUser.personName || 'Dentist');
        }
      }
    });
  }, []);

  const handleEditClick = () => {
    setTempName(dentistName);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userRef = ref(database, 'rhp/users');
      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Find the current user's key
          const userKey = Object.keys(data).find(key => data[key].role === 'dentist');
          if (userKey) {
            // Update existing user
            await update(ref(database, `rhp/users/${userKey}`), {
              personName: tempName
            });
          } else {
            // Create new user if not found
            const newUserRef = push(userRef);
            await update(newUserRef, {
              role: 'dentist',
              personName: tempName,
              createdAt: new Date().toISOString()
            });
          }
          setDentistName(tempName);
          toast.success('Name updated successfully');
        } else {
          // Initialize users collection if it doesn't exist
          const newUserRef = push(userRef);
          await update(newUserRef, {
            role: 'dentist',
            personName: tempName,
            createdAt: new Date().toISOString()
          });
          setDentistName(tempName);
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
    setTempName(dentistName);
    setIsEditing(false);
  };

  // Helper functions for tooltips
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <ToggleButton 
        onClick={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={() => showTooltip('toggle')}
        onMouseLeave={hideTooltip}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </ToggleButton>
      
      {activeTooltip === 'toggle' && (
        <TooltipContainer 
          isVisible={true}
          style={{
            top: '20px',
            left: isCollapsed ? '56px' : '240px',
            transform: 'translateY(0)',
          }}
        >
          {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </TooltipContainer>
      )}

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
                  <ActionButton 
                    onClick={handleSave} 
                    title="Save"
                    onMouseEnter={() => showTooltip('save')}
                    onMouseLeave={hideTooltip}
                  >
                    <Check size={16} />
                  </ActionButton>
                  
                  <ActionButton 
                    onClick={handleCancel} 
                    title="Cancel"
                    onMouseEnter={() => showTooltip('cancel')}
                    onMouseLeave={hideTooltip}
                  >
                    <X size={16} />
                  </ActionButton>
                </ActionButtons>
                
                {activeTooltip === 'save' && (
                  <TooltipContainer 
                    isVisible={true}
                    style={{
                      top: '50%',
                      left: '240px',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    Save name changes
                  </TooltipContainer>
                )}
                
                {activeTooltip === 'cancel' && (
                  <TooltipContainer 
                    isVisible={true}
                    style={{
                      top: '50%',
                      left: '240px',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    Cancel editing
                  </TooltipContainer>
                )}
              </>
            ) : (
              <>
                {dentistName}
                <EditButton 
                  onClick={handleEditClick} 
                  title="Edit name"
                  onMouseEnter={() => showTooltip('edit-name')}
                  onMouseLeave={hideTooltip}
                >
                  <Edit2 size={16} />
                </EditButton>
                
                {activeTooltip === 'edit-name' && (
                  <TooltipContainer 
                    isVisible={true}
                    style={{
                      top: '50%',
                      left: '240px',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    Edit your display name
                  </TooltipContainer>
                )}
              </>
            )}
          </LogoText>
        )}
      </LogoContainer>

      <SidebarMenu>
        <div style={{ position: 'relative' }}>
          <SidebarButton
            isActive={activeView === 'examination'}
            onClick={() => setActiveView('examination')}
            title="Dental Examination"
            onMouseEnter={() => showTooltip('examination')}
            onMouseLeave={hideTooltip}
          >
            <UserPlus size={iconSize} />
            {!isCollapsed && (
              <>
                <span>Dental Examination</span>
                <HelpButton
                  onClick={(e) => {
                    e.stopPropagation();
                    showTooltip('examination-help');
                  }}
                  onMouseLeave={hideTooltip}
                >
                  <Info size={14} />
                </HelpButton>
              </>
            )}
          </SidebarButton>
          
          {activeTooltip === 'examination' && isCollapsed && (
            <TooltipContainer 
              isVisible={true}
              style={{
                top: '50%',
                left: '56px',
                transform: 'translateY(-50%)',
              }}
            >
              Dental Examination
            </TooltipContainer>
          )}
          
          {activeTooltip === 'examination-help' && (
            <TooltipContainer 
              isVisible={true}
              style={{
                top: '0',
                left: '240px',
                width: '250px',
              }}
            >
              Conduct dental examinations for patients. View patient history, document current conditions, and recommend treatments.
            </TooltipContainer>
          )}
        </div>
        
        <div style={{ position: 'relative' }}>
          <SidebarButton
            isActive={activeView === 'appointments'}
            onClick={() => setActiveView('appointments')}
            title="Appointments"
            onMouseEnter={() => showTooltip('appointments')}
            onMouseLeave={hideTooltip}
          >
            <Calendar size={iconSize} />
            {!isCollapsed && (
              <>
                <span>Appointments</span>
                <HelpButton
                  onClick={(e) => {
                    e.stopPropagation();
                    showTooltip('appointments-help');
                  }}
                  onMouseLeave={hideTooltip}
                >
                  <Info size={14} />
                </HelpButton>
              </>
            )}
          </SidebarButton>
          
          {activeTooltip === 'appointments' && isCollapsed && (
            <TooltipContainer 
              isVisible={true}
              style={{
                top: '50%',
                left: '56px',
                transform: 'translateY(-50%)',
              }}
            >
              View Appointments
            </TooltipContainer>
          )}
          
          {activeTooltip === 'appointments-help' && (
            <TooltipContainer 
              isVisible={true}
              style={{
                top: '0',
                left: '240px',
                width: '250px',
              }}
            >
              Review your scheduled appointments. See patient details, appointment times, and reasons for visits.
            </TooltipContainer>
          )}
        </div>
      </SidebarMenu>

      <SidebarFooter>
        <SidebarButton
          onClick={() => navigate('/')}
          title="Logout"
          onMouseEnter={() => showTooltip('logout')}
          onMouseLeave={hideTooltip}
        >
          <LogOut size={iconSize} />
          {!isCollapsed && <span>Logout</span>}
        </SidebarButton>
        
        {activeTooltip === 'logout' && isCollapsed && (
          <TooltipContainer 
            isVisible={true}
            style={{
              top: '50%',
              left: '56px',
              transform: 'translateY(-50%)',
            }}
          >
            Logout from the system
          </TooltipContainer>
        )}
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;