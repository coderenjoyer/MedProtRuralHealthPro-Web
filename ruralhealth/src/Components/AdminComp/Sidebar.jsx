"use client";

import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaUser, FaDatabase, FaMedkit, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useState, useEffect } from "react";

const SidebarContainer = styled.div`
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

const AdminSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AdminIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  svg {
    font-size: 40px;
  }
`;

const AdminTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
`;

const NavMenu = styled.nav`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
  background-color: ${(props) => (props.$active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: rgba(9, 93, 126, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
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
const MainContent = styled.div`
  margin-left: 200px; /* Push content to the right */
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fb; /* Match sidebar theme */
`;

export default function Sidebar({ isOpen, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Validate props
  useEffect(() => {
    if (typeof isOpen !== 'boolean') {
      console.error('Invalid isOpen prop in Sidebar component');
      setError('Component configuration error');
    }
  }, [isOpen]);

  // Validate user session
  useEffect(() => {
    const validateSession = () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          throw new Error('No active session found');
        }
        // Additional session validation logic here
      } catch (error) {
        console.error('Session validation error:', error);
        handleLogout();
      }
    };

    validateSession();
  }, []);

  const handleNavigation = (path) => {
    try {
      if (!path || typeof path !== 'string') {
        throw new Error('Invalid navigation path');
      }
      setIsLoading(true);
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      setError('Error navigating to requested page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);

      // Clear session data
      localStorage.removeItem("user");
      // Add any additional cleanup logic here
      
      // Simulate cleanup delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error during logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      {isLoading && (
        <LoadingMessage>
          Loading...
        </LoadingMessage>
      )}

      <SidebarContainer $isOpen={isOpen}>
        <AdminSection>
          <AdminIcon>
            <FaUser />
          </AdminIcon>
          <AdminTitle>ADMIN</AdminTitle>
        </AdminSection>

        <NavMenu>
          <NavItem 
            onClick={() => handleNavigation("/admin/dashboard")} 
            $active={location.pathname === "/admin/dashboard"}
            disabled={isLoggingOut}
          >
            <MdDashboard /> Dashboard
          </NavItem>
          <NavItem 
            onClick={() => handleNavigation("/admin/user-database")} 
            $active={location.pathname === "/admin/user-database"}
            disabled={isLoggingOut}
          >
            <FaDatabase /> User Database
          </NavItem>
          <NavItem 
            onClick={() => handleNavigation("/admin/patient-database")} 
            $active={location.pathname === "/admin/patient-database"}
            disabled={isLoggingOut}
          >
            <FaDatabase /> Patient Database
          </NavItem>
          <NavItem 
            onClick={() => handleNavigation("/admin/medicine-inventory")} 
            $active={location.pathname === "/admin/medicine-inventory"}
            disabled={isLoggingOut}
          >
            <FaMedkit /> Medicine Inventory
          </NavItem>

          <LogoutItem 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <FaSignOutAlt /> {isLoggingOut ? 'Logging Out...' : 'Log Out'}
          </LogoutItem>
        </NavMenu>
      </SidebarContainer>

      <MainContent>
        {children}
      </MainContent>
    </>
  );
}
