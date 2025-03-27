import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rhp } from "../../Firebase/firebase";
import { get, child } from "firebase/database";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: url("/bgbgrh.png") no-repeat center center;
  background-size: cover; 
  background-attachment: fixed; 
`;  


const LoginBox = styled.div`
  width: 350px;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LogoSection = styled.div`
  margin-bottom: 0px;
`;

const Logo = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: 5px;
`;

const Title = styled.h2`
  margin-top: -5px;
  font-size: 25px;
  color: black;
  margin-bottom: 5px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-size: 16px;
  color: black;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  color: black;
  border-radius: 5px;
  border: 1px solid ${props => props.$hasError ? '#dc3545' : '#ccc'};
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc3545' : '#26C6DA'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(38, 198, 218, 0.25)'};
  }
`;

const Option = styled.option`
  font-size: 16px;
`;

const Input = styled.input`
  width: 95%;
  padding: 8px;
  font-size: 16px;
  color: black;
  border-radius: 5px;
  border: 1px solid ${props => props.$hasError ? '#dc3545' : '#ccc'};
  background-color: #f9f9f9;
  display: block; 
  margin: 0 auto;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc3545' : '#26C6DA'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(38, 198, 218, 0.25)'};
  }
`;


const LoginButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #26C6DA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background-color: #00BCD4;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
  background-color: #d4edda;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
`;

const RuralHealthLogin = () => {
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  // Reset form errors when inputs change
  useEffect(() => {
    setFormErrors({});
    setError("");
    setSuccess("");
  }, [userType, password]);

  // Check for locked state on component mount
  useEffect(() => {
    const lockedUntil = localStorage.getItem('loginLockedUntil');
    if (lockedUntil) {
      const lockTime = parseInt(lockedUntil);
      if (Date.now() < lockTime) {
        setIsLocked(true);
        const remainingTime = Math.ceil((lockTime - Date.now()) / 1000);
        setError(`Account is temporarily locked. Please try again in ${remainingTime} seconds.`);
      } else {
        localStorage.removeItem('loginLockedUntil');
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!userType) {
      errors.userType = "Please select a user type";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Check user credentials in Firebase
      const userRef = child(rhp, `users/${userType}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Check if account is locked
        if (userData.isLocked && userData.lockedUntil > Date.now()) {
          const remainingTime = Math.ceil((userData.lockedUntil - Date.now()) / 1000);
          setError(`Account is temporarily locked. Please try again in ${remainingTime} seconds.`);
          setIsLocked(true);
          return;
        }

        if (userData.password === password) {
          // Reset attempts on successful login
          setAttempts(0);
          localStorage.removeItem('loginAttempts');
          localStorage.removeItem('loginLockedUntil');
          
          // Set success message
          setSuccess("Login successful! Redirecting...");

          // Store user session
          localStorage.setItem("user", JSON.stringify({
            type: userType,
            id: userData.id,
            name: userData.name
          }));

          // Add delay for success message visibility
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Navigate based on user type
          switch (userType) {
            case "Staff-Admin":
              navigate("/admin");
              break;
            case "Doctor-Physician":
              navigate("/doctor");
              break;
            case "Staff-FrontDesk":
              navigate("/front");
              break;
            case "Specialist-Dentist":
              navigate("/spec");
              break;
            default:
              setError("Invalid user type.");
          }
        } else {
          // Handle failed login attempt
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          localStorage.setItem('loginAttempts', newAttempts);

          if (newAttempts >= 3) {
            const lockTime = Date.now() + (5 * 60 * 1000); // 5 minutes
            localStorage.setItem('loginLockedUntil', lockTime);
            setIsLocked(true);
            setError("Too many failed attempts. Account locked for 5 minutes.");
          } else {
            setError(`Invalid password. ${3 - newAttempts} attempts remaining.`);
          }
        }
      } else {
        setError("User not found.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <Logo src="/RH.png" alt="Rural Health Logo" />
        </LogoSection>
        <Title>SIGN IN</Title>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="user-type">User Type</Label>
            <Select
              id="user-type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              $hasError={!!formErrors.userType}
            >
              <Option value="" disabled>Log in As</Option>
              <Option value="Staff-Admin">Staff - Admin</Option>
              <Option value="Staff-FrontDesk">Staff - Front Desk</Option>
              <Option value="Doctor-Physician">Doctor - Physician</Option>
              <Option value="Specialist-Dentist">Specialist - Dentist</Option>
            </Select>
            {formErrors.userType && <ErrorMessage>{formErrors.userType}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              $hasError={!!formErrors.password}
            />
            {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <LoginButton type="submit" disabled={loading || isLocked}>
            {loading ? (
              <>
                <LoadingSpinner />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </LoginButton>
        </form>
      </LoginBox>
    </Container>
  );
};

export default RuralHealthLogin;