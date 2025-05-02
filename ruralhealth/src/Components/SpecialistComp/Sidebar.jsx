"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Stethoscope, Calendar, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

const theme = {
  shadows: { lg: "0 4px 12px rgba(0, 0, 0, 0.1)" },
  borderRadius: { full: "50%", md: "8px" },
  colors: { white: "#ffffff" },
};

const SidebarContainer = styled.aside`
  width: ${({ isCollapsed }) => (isCollapsed ? "80px" : "240px")};
  background: linear-gradient(180deg, #4FC3F7 0%, #29b6f6 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 10;
  height: 100vh;
  position: fixed;
  transition: width 0.3s ease;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: -16px;
  top: 20px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 20;
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
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const NavItems = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
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
  padding: 1rem 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: all 0.2s ease;

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
  margin-right: ${({ isCollapsed }) => (isCollapsed ? "0" : "1rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
`;

const Footer = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, #4FC3F7 0%, #29b6f6 100%);
  position: sticky;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(79, 195, 247, 0.2);
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(79, 195, 247, 0.3);
  }

  svg {
    margin-right: ${({ isCollapsed }) => (isCollapsed ? "0" : "0.75rem")};
  }
`;

const Sidebar = ({ selectedMenu, setSelectedMenu, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const iconSize = isCollapsed ? 28 : 20;

  useEffect(() => {
    if (onToggle) onToggle(isCollapsed);
  }, [isCollapsed, onToggle]);

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </ToggleButton>
      <Logo>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LogoText isCollapsed={isCollapsed}>Front Desk</LogoText>
        </motion.div>
      </Logo>
      <NavItems>
        <NavItem
          active={selectedMenu === "examination"}
          onClick={() => setSelectedMenu("examination")}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? "Dental Examination" : ""}
        >
          <IconWrapper isCollapsed={isCollapsed}>
            <Stethoscope size={iconSize} />
          </IconWrapper>
          {!isCollapsed && "Dental Examination"}
        </NavItem>
        <NavItem
          active={selectedMenu === "appointments"}
          onClick={() => setSelectedMenu("appointments")}
          whileTap={{ scale: 0.95}}
          title={isCollapsed ? "Appointments" : ""}
        >
          <IconWrapper isCollapsed={isCollapsed}>
            <Calendar size={iconSize} />
          </IconWrapper>
          {!isCollapsed && "Appointments"}
        </NavItem>
      </NavItems>
      <Footer>
        <LogoutButton
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          isCollapsed={isCollapsed}
          title={isCollapsed ? "Log Out" : ""}
        >
          <IconWrapper isCollapsed={isCollapsed}>
            <LogOut size={isCollapsed ? 24 : 18} />
          </IconWrapper>
          {!isCollapsed && "Log Out"}
        </LogoutButton>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
