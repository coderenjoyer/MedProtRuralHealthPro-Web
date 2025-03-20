"use client";

import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaUser, FaDatabase, FaMedkit, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const SidebarContainer = styled.div`
  background-color: #004b87;
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

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
  background-color: ${(props) => (props.$active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <SidebarContainer $isOpen={isOpen}>
        <AdminSection>
          <AdminIcon>
            <FaUser />
          </AdminIcon>
          <AdminTitle>ADMIN</AdminTitle>
        </AdminSection>

        <NavMenu>
          <NavItem onClick={() => navigate("/admin/dashboard")} $active={location.pathname === "/admin/dashboard"}>
            <MdDashboard /> Dashboard
          </NavItem>
          <NavItem onClick={() => navigate("/admin/user-database")} $active={location.pathname === "/admin/user-database"}>
            <FaDatabase /> User Database
          </NavItem>
          <NavItem onClick={() => navigate("/admin/patient-database")} $active={location.pathname === "/admin/patient-database"}>
            <FaDatabase /> Patient Database
          </NavItem>
          <NavItem onClick={() => navigate("/admin/medicine-inventory")} $active={location.pathname === "/admin/medicine-inventory"}>
            <FaMedkit /> Medicine Inventory
          </NavItem>

          <LogoutItem onClick={handleLogout}>
            <FaSignOutAlt /> Log Out
          </LogoutItem>
        </NavMenu>
      </SidebarContainer>

    
      <MainContent>
        {children} {/* Renders whatever content is passed inside */}
      </MainContent>
    </>
  );
}
