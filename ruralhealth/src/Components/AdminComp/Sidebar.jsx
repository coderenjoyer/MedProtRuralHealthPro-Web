"use client";

import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaDatabase, FaMedkit, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarContainer = styled(motion.div)`
  background-color: #095D7E;
  width: 200px;
  height: 100vh;
  color: white;
  padding: 20px 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000; /* Ensures sidebar stays on top */

  @media (max-width: 768px) {
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
  }
`;

const AdminSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AdminTitle = styled(motion.div)`
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled(motion.button)`
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

const NameInput = styled(motion.input)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 1.2rem;
  width: 100px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: 0.25rem;
  margin-left: 0.5rem;
`;

const ActionButton = styled(motion.button)`
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

const NavMenu = styled(motion.nav)`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
  background-color: ${(props) => (props.$active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  cursor: pointer;

  &:hover {
    background-color: rgba(9, 93, 126, 0.3);
  }

  svg {
    margin-right: 10px;
  }
`;

const LogoutItem = styled(NavItem)`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

/* ✅ Wrapper for the main content */
const MainContent = styled(motion.div)`
  margin-left: 200px; /* Push content to the right */
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fb; /* Match sidebar theme */
`;

export default function Sidebar({ isOpen, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [adminName, setAdminName] = useState('ADMIN');
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    // Load admin name from database
    const userRef = ref(database, 'rhp/users');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Find the current user's data
        const currentUser = Object.values(data).find(user => user.role === 'admin');
        if (currentUser) {
          setAdminName(currentUser.personName || 'ADMIN');
        }
      }
    });
  }, []);

  const handleEditClick = () => {
    setTempName(adminName);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (tempName.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const userRef = ref(database, 'rhp/users');
      const snapshot = await onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Find the current user's data
          const currentUser = Object.entries(data).find(([_, user]) => user.role === 'admin');
          if (currentUser) {
            const [userId, userData] = currentUser;
            // Update the user's name
            update(ref(database, `rhp/users/${userId}`), {
              ...userData,
              personName: tempName
            });
            setAdminName(tempName);
            setIsEditing(false);
            toast.success('Name updated successfully');
          }
        }
      });
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempName('');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <SidebarContainer 
        $isOpen={isOpen}
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AdminSection
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AdminTitle>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <NameInput
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                  />
                  <ActionButtons>
                    <ActionButton 
                      onClick={handleSave} 
                      title="Save"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={handleCancel} 
                      title="Cancel"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={16} />
                    </ActionButton>
                  </ActionButtons>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {adminName}
                  <EditButton 
                    onClick={handleEditClick} 
                    title="Edit name"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 size={16} />
                  </EditButton>
                </motion.div>
              )}
            </AnimatePresence>
          </AdminTitle>
        </AdminSection>

        <NavMenu
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <NavItem 
            onClick={() => navigate("/admin/dashboard")} 
            $active={location.pathname === "/admin/dashboard"}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdDashboard /> Dashboard
          </NavItem>
          <NavItem 
            onClick={() => navigate("/admin/user-database")} 
            $active={location.pathname === "/admin/user-database"}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaDatabase /> User Database
          </NavItem>
          <NavItem 
            onClick={() => navigate("/admin/patient-database")} 
            $active={location.pathname === "/admin/patient-database"}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaDatabase /> Patient Database
          </NavItem>
          <NavItem 
            onClick={() => navigate("/admin/medicine-inventory")} 
            $active={location.pathname === "/admin/medicine-inventory"}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaMedkit /> Medicine Inventory
          </NavItem>

          <LogoutItem 
            onClick={handleLogout}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignOutAlt /> Log Out
          </LogoutItem>
        </NavMenu>
      </SidebarContainer>

      <MainContent
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {children} {/* Renders whatever content is passed inside */}
      </MainContent>
    </>
  );
}
