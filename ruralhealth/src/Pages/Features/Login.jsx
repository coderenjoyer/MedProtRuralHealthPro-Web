import { useState } from "react";
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
  background-size: cover; /* ✅ Ensures it spans the entire background */
  background-attachment: fixed; /* ✅ Prevents scrolling issues */
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

const RuralHealthLogin = () => {
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check user credentials in Firebase
      const userRef = child(rhp, `users/${userType}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
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
          setError("Invalid password.");
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
          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </form>
      </LoginBox>
    </Container>
  );
};

export default RuralHealthLogin;