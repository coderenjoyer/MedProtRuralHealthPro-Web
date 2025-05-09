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
  border: 1px solid #ccc;
  background-color: #f9f9f9;
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
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  display: block; 
  margin: 0 auto;
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

const AdminBypassLink = styled.a`
  color: #26C6DA;
  text-decoration: underline;
  cursor: pointer;
  display: block;
  margin-top: 10px;
  font-size: 14px;

  &:hover {
    color: #00BCD4;
  }
`;

const AdminPasswordModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;

const RuralHealthLogin = () => {
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored attempts and last attempt time
    const storedAttempts = sessionStorage.getItem('loginAttempts');
    const storedLastAttempt = sessionStorage.getItem('lastAttemptTime');
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
    if (storedLastAttempt) {
      setLastAttemptTime(parseInt(storedLastAttempt));
    }
  }, []);

  useEffect(() => {
    // Check if cooldown should be active
    if (lastAttemptTime) {
      const now = Date.now();
      const timeDiff = now - lastAttemptTime;
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (timeDiff < cooldownPeriod && attempts >= 5) {
        setCooldownActive(true);
      } else if (timeDiff >= cooldownPeriod) {
        setCooldownActive(false);
        setAttempts(0);
        setLastAttemptTime(null);
        sessionStorage.removeItem('loginAttempts');
        sessionStorage.removeItem('lastAttemptTime');
      }
    }
  }, [lastAttemptTime, attempts]);

  const handleAdminBypass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check admin password in Firebase
      const adminRef = child(rhp, `users/Staff-Admin`);
      const snapshot = await get(adminRef);
      
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        if (adminData.password === adminPassword) {
          // Reset attempts and cooldown
          setAttempts(0);
          setCooldownActive(false);
          sessionStorage.removeItem('loginAttempts');
          sessionStorage.removeItem('lastAttemptTime');
          
          // Store user type and navigate
          sessionStorage.setItem('userType', userType);
          navigate("/admin");
        } else {
          setError("Invalid admin password.");
        }
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("Admin bypass error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if user is in cooldown period
    if (cooldownActive && userType !== "Staff-Admin") {
      const remainingTime = Math.ceil((5 * 60 * 1000 - (Date.now() - lastAttemptTime)) / 1000 / 60);
      setError(`Too many failed attempts. Please try again in ${remainingTime} minutes or contact admin.`);
      setLoading(false);
      return;
    }

    try {
      // Check user credentials in Firebase
      const userRef = child(rhp, `users/${userType}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          // Reset attempts on successful login
          setAttempts(0);
          sessionStorage.removeItem('loginAttempts');
          sessionStorage.removeItem('lastAttemptTime');
          
          // Store user type in sessionStorage
          sessionStorage.setItem('userType', userType);
          
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
          // Increment failed attempts if not admin
          if (userType !== "Staff-Admin") {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            sessionStorage.setItem('loginAttempts', newAttempts);
            
            if (newAttempts >= 5) {
              setLastAttemptTime(Date.now());
              sessionStorage.setItem('lastAttemptTime', Date.now());
              setError("Too many failed attempts. Please try again in 5 minutes or contact admin.");
            } else {
              setError(`Invalid password. ${5 - newAttempts} attempts remaining.`);
            }
          } else {
            setError("Invalid password.");
          }
        }
      } else {
        setError("User not found.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
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
            >
              <Option value="" disabled>Log in As</Option>
              <Option value="Staff-Admin">Staff - Admin</Option>
              <Option value="Staff-FrontDesk">Staff - Front Desk</Option>
              <Option value="Doctor-Physician">Doctor - Physician</Option>
              <Option value="Specialist-Dentist">Specialist - Dentist</Option>
            </Select>
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
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {cooldownActive && userType !== "Staff-Admin" && (
            <AdminBypassLink onClick={() => setShowAdminModal(true)}>
              Contact admin for immediate access
            </AdminBypassLink>
          )}
          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </form>
      </LoginBox>

      {showAdminModal && (
        <AdminPasswordModal>
          <ModalContent>
            <h3>Admin Verification</h3>
            <p>Please enter admin password to proceed</p>
            <InputGroup>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </InputGroup>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <LoginButton onClick={handleAdminBypass} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </LoginButton>
            <AdminBypassLink 
              onClick={() => {
                setShowAdminModal(false);
                setAdminPassword("");
                setError("");
              }}
              style={{ marginTop: "10px" }}
            >
              Cancel
            </AdminBypassLink>
          </ModalContent>
        </AdminPasswordModal>
      )}
    </Container>
  );
};

export default RuralHealthLogin;