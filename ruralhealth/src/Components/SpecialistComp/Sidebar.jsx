"use client"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom" 
import { Stethoscope, Calendar, LogOut, User } from "lucide-react"
import { useState } from "react"

const SidebarContainer = styled.aside`
  width: 240px;
  background: linear-gradient(180deg, #4FC3F7 0%, #29b6f6 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 10;
  height: 100vh;
  position: relative;
`

const Logo = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
`

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
`

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

  ${({ active, theme }) =>
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
`

const IconWrapper = styled.span`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Footer = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, #4FC3F7 0%, #29b6f6 100%);
  position: sticky;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
`

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
    margin-right: 0.75rem;
  }
`

const Sidebar = ({ setActiveView, activeView }) => {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleViewChange = (view) => {
    try {
      if (!view || typeof view !== 'string') {
        throw new Error('Invalid view parameter')
      }
      setActiveView(view)
    } catch (error) {
      console.error('Error changing view:', error)
      // Fallback to examination view if there's an error
      setActiveView('examination')
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Add any cleanup logic here (e.g., clearing session data)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate cleanup
      navigate('/')
    } catch (error) {
      console.error('Error during logout:', error)
      // Still navigate to home even if there's an error
      navigate('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarContainer>
      <Logo>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
          <LogoIcon>
            <Stethoscope size={40} />
          </LogoIcon>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LogoText>SPECIALIST</LogoText>
        </motion.div>
      </Logo>

      <NavItems>
        <NavItem
          active={activeView === "examination"}
          onClick={() => handleViewChange("examination")}
          whileTap={{ scale: 0.95 }}
          disabled={isLoggingOut}
        >
          <IconWrapper>
            <Stethoscope size={20} />
          </IconWrapper>
          Dental Examination
        </NavItem>

        <NavItem
          active={activeView === "appointments"}
          onClick={() => handleViewChange("appointments")}
          whileTap={{ scale: 0.95 }}
          disabled={isLoggingOut}
        >
          <IconWrapper>
            <Calendar size={20} />
          </IconWrapper>
          Appointments
        </NavItem>
      </NavItems>

      <Footer>
        <LogoutButton 
          whileTap={{ scale: 0.95 }} 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <IconWrapper>
            <LogOut size={18} />
          </IconWrapper>
          {isLoggingOut ? 'Logging Out...' : 'Log Out'}
        </LogoutButton>
      </Footer>
    </SidebarContainer>
  )
}

export default Sidebar
