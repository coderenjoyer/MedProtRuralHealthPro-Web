import styled from "styled-components"
import { FaUser, FaDatabase, FaMedkit, FaSignOutAlt } from "react-icons/fa"
import { MdDashboard } from "react-icons/md"
import { useNavigate } from "react-router-dom"

const SidebarContainer = styled.div`
  background-color: #004b87;
  width: 200px;
  height: 100vh;
  color: white;
  padding: 20px 0;
  position: fixed;
  left: 0;
  top: 0;
  transition: transform 0.3s ease;
  z-index: 1000;

  @media (max-width: 768px) {
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
  }
`

const AdminSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

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
`

const AdminTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
`

const NavMenu = styled.nav`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
`

const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 10px;
  }
`

const LogoutItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 10px;
  }
`

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <SidebarContainer $isOpen={isOpen}>
      <AdminSection>
        <AdminIcon>
          <FaUser />
        </AdminIcon>
        <AdminTitle>ADMIN</AdminTitle>
      </AdminSection>

      <NavMenu>
        <NavItem href="#">
          <MdDashboard /> Dashboard
        </NavItem>
        <NavItem href="#">
          <FaDatabase /> User Database
        </NavItem>
        <NavItem href="#">
          <FaDatabase /> Patient Database
        </NavItem>
        <NavItem href="#">
          <FaMedkit /> Medicine Inventory
        </NavItem>

        <LogoutItem onClick={handleLogout}>
          <FaSignOutAlt /> Log Out
        </LogoutItem>
      </NavMenu>
    </SidebarContainer>
  )
}
