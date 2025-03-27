import React, { useState, useEffect } from "react";
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

const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
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
  border-radius: 10px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Sidebar = ({ isOpen, toggleSidebar, selectedButton, setSelectedButton }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  // Validate props
  useEffect(() => {
    if (typeof isOpen !== 'boolean' || typeof selectedButton !== 'string') {
      console.error('Invalid props received in Sidebar component');
      setError('Component configuration error');
    }
  }, [isOpen, selectedButton]);

  const handleImageUpload = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        throw new Error('Error reading image file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Error uploading image');
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleButtonClick = (buttonName) => {
    try {
      if (!buttonName || typeof buttonName !== 'string') {
        throw new Error('Invalid button name');
      }
      setSelectedButton(buttonName);
    } catch (error) {
      console.error('Error handling button click:', error);
      setError('Error changing view');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      
      // Add any cleanup logic here (e.g., clearing session data)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate cleanup
      
      navigate("/");
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Error during logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
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
        <ToggleButton 
          onClick={toggleSidebar}
          disabled={isLoggingOut}
        >
          <div />
        </ToggleButton>

        <LogoContainer $isOpen={isOpen}>
          <HiddenFileInput 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            disabled={isLoggingOut}
          />
          <UploadCircle>
            {image ? (
              <img
                src={image}
                alt="Profile"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                onError={() => setError('Error loading profile image')}
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
            className={selectedButton === "patientdiagnosis" ? "selected" : ""}
            onClick={() => handleButtonClick("patientdiagnosis")}
            disabled={isLoggingOut}
          >
            <Plus />
            {isOpen && <span>Patient Diagnosis</span>}
          </Button>

          <Button
            $isOpen={isOpen}
            className={selectedButton === "appointments" ? "selected" : ""}
            onClick={() => handleButtonClick("appointments")}
            disabled={isLoggingOut}
          >
            <User />
            {isOpen && <span>Appointments</span>}
          </Button>
        </ButtonGroup>

        <Footer $isOpen={isOpen}>
          <Button 
            $isOpen={isOpen} 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut />
            {isOpen && <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>}
          </Button>
        </Footer>
      </SidebarContainer>
    </div>
  );
};

export default Sidebar;
