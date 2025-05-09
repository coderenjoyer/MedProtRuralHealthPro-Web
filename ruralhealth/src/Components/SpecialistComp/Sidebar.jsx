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
  X
} from 'lucide-react';
import styled from "styled-components";
import { ref, onValue, update, push } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';

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
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: white;
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  width: 120px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
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
  color: white;
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
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
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

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
                {dentistName}
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
          isActive={activeView === 'examination'}
          onClick={() => setActiveView('examination')}
          title="Dental Examination"
        >
          <UserPlus size={iconSize} />
          {!isCollapsed && <span>Dental Examination</span>}
        </SidebarButton>
        <SidebarButton
          isActive={activeView === 'appointments'}
          onClick={() => setActiveView('appointments')}
          title="Appointments"
        >
          <Calendar size={iconSize} />
          {!isCollapsed && <span>Appointments</span>}
        </SidebarButton>
      </SidebarMenu>

      <SidebarFooter>
        <SidebarButton
          onClick={() => navigate('/')}
          title="Logout"
        >
          <LogOut size={iconSize} />
          {!isCollapsed && <span>Logout</span>}
        </SidebarButton>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;