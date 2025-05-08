import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Plus, Calendar, LogOut } from "lucide-react";

// Define theme object
const theme = {
  shadows: { lg: "0 4px 12px rgba(0, 0, 0, 0.1)" },
  borderRadius: { full: "50%", md: "8px" },
  colors: { 
    white: "#ffffff", 
    black: "#000000",
    red: "#D32F2F", 
    redHover: "#E53935", 
    redActive: "#B71C1C",
    primary: "#4FC3F7",
    primaryDark: "#29B6F6"
  },
};

// Styled components
const SidebarContainer = styled.aside`
  width: ${({ $isCollapsed }) => ($isCollapsed ? "80px" : "260px")};
  background: linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.black};
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.shadows.lg};
  z-index: 10;
  height: 100vh;
  position: relative;
  transition: width 0.3s ease;
`;

const ToggleButton = styled.button`
  align-self: flex-end;
  margin: 20px 20px 40px 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  outline: none;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
    stroke: ${theme.colors.black};
    stroke-width: 2;
    transform: ${({ $isCollapsed }) => ($isCollapsed ? "rotate(0deg)" : "rotate(180deg)")};
    transition: transform 0.3s ease;
  }
`;

const Logo = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoText = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  color: ${theme.colors.black};
`;

const NavItems = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const NavItem = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  padding: 0.75rem;
  background: none;
  border: none;
  color: ${theme.colors.black};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  margin: 0 12px 12px;
  border-radius: 8px;
  width: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "calc(100% - 24px)")};
  height: 48px;

  &:hover {
    background-color: rgba(79, 195, 247, 0.2);
  }

  ${({ active }) =>
    active &&
    `
    background-color: rgba(79, 195, 247, 0.3);
    font-weight: 600;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: ${theme.colors.white};
    }
  `}
`;

const IconWrapper = styled.span`
  margin-right: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "1rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
`;

const Footer = styled.div`
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  position: sticky;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
`;

const LogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  width: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "calc(100% - 24px)")};
  height: 48px;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "0.75rem")};
  background: ${theme.colors.red};
  border: none;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 12px;

  &:hover {
    background: ${theme.colors.redHover};
    box-shadow: 0 0 10px rgba(213, 47, 47, 0.5);
  }

  &:active {
    background: ${theme.colors.redActive};
  }

  svg {
    margin-right: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "0.75rem")};
    transform: ${({ $isCollapsed }) => ($isCollapsed ? "rotate(0deg)" : "none")};
    transition: transform 0.3s ease;
  }
`;

const Sidebar = ({ selectedButton, setSelectedButton }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const iconSize = isCollapsed ? 24 : 20;

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <SidebarContainer $isCollapsed={isCollapsed}>
      <ToggleButton 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        $isCollapsed={isCollapsed}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M9 18L15 12L9 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </ToggleButton>
      <Logo>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LogoText $isCollapsed={isCollapsed}>DOCTOR</LogoText>
        </motion.div>
      </Logo>
      <NavItems>
        <NavItem
          $isCollapsed={isCollapsed}
          active={selectedButton === "patientdiagnosis"}
          onClick={() => setSelectedButton("patientdiagnosis")}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? "Patient Diagnosis" : ""}
        >
          <IconWrapper $isCollapsed={isCollapsed}>
            <Plus size={iconSize} color={theme.colors.white} />
          </IconWrapper>
          {!isCollapsed && "Patient Diagnosis"}
        </NavItem>
        <NavItem
          $isCollapsed={isCollapsed}
          active={selectedButton === "appointments"}
          onClick={() => setSelectedButton("appointments")}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? "Appointments" : ""}
        >
          <IconWrapper $isCollapsed={isCollapsed}>
            <Calendar size={iconSize} color={theme.colors.white} />
          </IconWrapper>
          {!isCollapsed && "Appointments"}
        </NavItem>
      </NavItems>
      <Footer>
        <LogoutButton
          $isCollapsed={isCollapsed}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          title={isCollapsed ? "Log Out" : ""}
        >
          <IconWrapper $isCollapsed={isCollapsed}>
            <LogOut size={iconSize} color={theme.colors.white} />
          </IconWrapper>
          {!isCollapsed && "Log Out"}
        </LogoutButton>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;