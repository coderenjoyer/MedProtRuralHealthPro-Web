import React, { useState } from "react";
import styled from "styled-components";
import { Calendar, Plus, LogOut, Camera, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SidebarContainer = styled.div`
  height: 100vh;
  background-color: #b2ebf2;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.$isOpen ? "260px" : "70px")};
  transition: width 0.5s ease;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  align-self: flex-end;
  font-size: 2rem;
  margin-bottom: 32px;
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  outline: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #26c6da;
    border-radius: 6px;
    transform: scale(1.1);
  }

  &:active {
    background-color: #e0f7fa;
    transform: scale(0.95);
  }

  &::before,
  &::after {
    content: "";
    display: block;
    width: 30px;
    height: 3px;
    background-color: black;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  & > div {
    width: 30px;
    height: 3px;
    background-color: black;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
`;

const LogoContainer = styled.label`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 60px;
  cursor: pointer;
`;

const UploadCircle = styled.div`
  width: 190px;
  height: 190px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #4dd0e1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  padding: 10px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const DoctorText = styled.div`
  margin-top: 15px;
  font-weight: bold;
  font-size: 1.7rem;
  letter-spacing: 1px;
`;

const Button = styled.button`
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
  margin-bottom: 18px;
  justify-content: ${(props) => (props.$isOpen ? "flex-start" : "center")};
  transition: background-color 0.3s ease, border 0.3s ease;
  outline: none;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: #26c6da;
    border: 2px solid #26c6da;
  }

  &:active {
    background-color: #e0f7fa;
    border: 2px solid #e0f7fa !important;
  }

  &.selected {
    background-color: #e0f7fa;
    border: 2px solid #4dd0e1 !important;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.$isOpen ? "flex-start" : "center")};
`;

const ButtonGroup = styled.div`
  margin-top: 60px;
`;

const Sidebar = ({ isOpen, toggleSidebar, selectedButton, setSelectedButton }) => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    
    navigate("/");
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarContainer $isOpen={isOpen}>
        <ToggleButton onClick={toggleSidebar}>
          <div />
        </ToggleButton>

        <LogoContainer $isOpen={isOpen}>
          <HiddenFileInput type="file" accept="image/*" onChange={handleImageUpload} />
          <UploadCircle>
            {image ? (
              <img
                src={image}
                alt="Profile"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <Camera size={54} color="#555" />
            )}
          </UploadCircle>
          <DoctorText>DOCTOR</DoctorText>
        </LogoContainer>

        <ButtonGroup>
          <Button
            $isOpen={isOpen}
            className={selectedButton === "diagnosis" ? "selected" : ""}
            onClick={() => setSelectedButton("diagnosis")}
          >
            <Plus />
            {isOpen && <span>Patient Diagnosis</span>}
          </Button>

          <Button
            $isOpen={isOpen}
            className={selectedButton === "appointments" ? "selected" : ""}
            onClick={() => setSelectedButton("appointments")}
          >
            <User />
            {isOpen && <span>Appointments</span>}
          </Button>

          <Button
            $isOpen={isOpen}
            className={selectedButton === "calendar" ? "selected" : ""}
            onClick={() => setSelectedButton("calendar")}
          >
            <Calendar />
            {isOpen && <span>Calendar</span>}
          </Button>
        </ButtonGroup>

        <Footer $isOpen={isOpen}>
          <Button $isOpen={isOpen} onClick={handleLogout}> 
            <LogOut />
            {isOpen && <span>Log Out</span>}
          </Button>
        </Footer>
      </SidebarContainer>
    </div>
  );
};

export default Sidebar;
